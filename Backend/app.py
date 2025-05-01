from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import pandas as pd
import shap
import numpy as np
import io
import os
import joblib
import time
from werkzeug.utils import secure_filename
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from imblearn.pipeline import Pipeline
from imblearn.combine import SMOTEENN

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Set up file upload config
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Set up model storage
MODEL_FOLDER = 'models'
if not os.path.exists(MODEL_FOLDER):
    os.makedirs(MODEL_FOLDER)

# Path for storing the active model choice
ACTIVE_MODEL_PATH = os.path.join(MODEL_FOLDER, 'active_model.txt')

# Ensure we have a default active model
if not os.path.exists(ACTIVE_MODEL_PATH):
    with open(ACTIVE_MODEL_PATH, 'w') as f:
        f.write('original')  # Default to the original model

# --- Load the trained pipeline and components ---
model = pickle.load(open("model_pipeline.sav", "rb"))
model_shap = model.named_steps['classifier']
preprocessor = model.named_steps['preprocessor']
explainer = shap.TreeExplainer(model_shap)

# --- Precompute simple churn-rate EDA for categorical flags ---
df = pd.read_csv("churn.csv").drop('customerID', axis=1)
overall_churn = df['Churn'].mean()
cat_cols = [
    'gender', 'Partner', 'Dependents', 'PhoneService', 'MultipleLines',
    'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection',
    'TechSupport', 'StreamingTV', 'StreamingMovies', 'Contract',
    'PaperlessBilling', 'PaymentMethod'
]
churn_rate = {col: df.groupby(col)['Churn'].mean().to_dict() for col in cat_cols}

# Define feature descriptions for better explanations
feature_descriptions = {
    'MonthlyCharges': {
        'high': 'High monthly charges increase churn risk',
        'low': 'Low monthly charges reduce churn risk'
    },
    'TotalCharges': {
        'high': 'High total charges (customer value) reduce churn risk',
        'low': 'Low total charges increase churn risk'
    },
    'tenure': {
        'high': 'Longer customer relationship reduces churn risk',
        'low': 'Newer customers are more likely to churn'
    }
}

# Store feature value percentiles for context
numeric_features = ['MonthlyCharges', 'TotalCharges', 'tenure']
percentiles = {}

# Ensure DataFrame has numeric types before computing percentiles
for feat in numeric_features:
    df[feat] = pd.to_numeric(df[feat], errors='coerce')

for feat in numeric_features:
    percentiles[feat] = {
        'low': float(np.percentile(df[feat], 25)),
        'medium': float(np.percentile(df[feat], 50)),
        'high': float(np.percentile(df[feat], 75))
    }

def get_active_model_object():
    try:
        with open(ACTIVE_MODEL_PATH, 'r') as f:
            active_model = f.read().strip()
        
        if active_model == 'original':
            return pickle.load(open("model_pipeline.sav", "rb"))
        else:
            retrained_path = os.path.join(MODEL_FOLDER, 'retrained_model.joblib')
            return joblib.load(retrained_path)
    except Exception:
        # Fallback to original model if there's any issue
        return pickle.load(open("model_pipeline.sav", "rb"))

def refresh_model_components():
    """Update global model components based on active model"""
    global model, model_shap, preprocessor, explainer
    
    model = get_active_model_object()
    model_shap = model.named_steps['classifier']
    preprocessor = model.named_steps['preprocessor']
    explainer = shap.TreeExplainer(model_shap)
    
    return model

def process_customer_data(input_df):
    """Process a single customer record or batch of records and return predictions with insights"""
    # Refresh model components to ensure we're using the active model
    refresh_model_components()
    
    results = []
    
    # Make a copy to avoid modifying the original
    processed_df = input_df.copy()
    
    # Ensure numeric features are properly converted
    for col in numeric_features:
        if col in processed_df.columns:
            processed_df[col] = pd.to_numeric(processed_df[col], errors='coerce')
    
    # Make predictions for all rows
    predictions = model.predict(processed_df)
    probabilities = model.predict_proba(processed_df)[:, 1]
    
    # Process each customer row
    for i in range(len(processed_df)):
        row_df = processed_df.iloc[[i]]
        
        # Preprocess input for SHAP (skip SMOTE)
        processed_input = preprocessor.transform(row_df)
        
        # SHAP values for the positive class (churn)
        shap_values = explainer.shap_values(processed_input)
        shap_pos = shap_values[1] if isinstance(shap_values, list) else shap_values
        shap_vals = shap_pos[0]
        if isinstance(shap_vals, np.ndarray) and shap_vals.ndim > 1:
            shap_vals = shap_vals.flatten()
        
        feature_names = preprocessor.get_feature_names_out()
        feat_imp = dict(zip(feature_names, shap_vals.tolist()))
        
        # Extract significant numeric SHAP drivers (threshold applied)
        numeric_keys = ['num__MonthlyCharges', 'num__TotalCharges', 'num__tenure']
        numeric_reasons = []
        
        for k in numeric_keys:
            if k in feat_imp and abs(feat_imp[k]) > 0.05:  # Only include significant contributors
                feature = k.replace('num__', '')
                shap_value = feat_imp[k]
                
                # Add context about the feature value
                value = float(row_df[feature].iat[0])  # Ensure value is a float
                if value < float(percentiles[feature]['low']):
                    value_category = 'low'
                elif value > float(percentiles[feature]['high']):
                    value_category = 'high'
                else:
                    value_category = 'medium'
                    
                explanation = feature_descriptions[feature]['high'] if shap_value > 0 else feature_descriptions[feature]['low']
                
                numeric_reasons.append({
                    'feature': feature,
                    'shap_value': round(shap_value, 3),
                    'value': float(value),
                    'category': value_category,
                    'explanation': explanation
                })
        
        # Sort by absolute SHAP value
        numeric_reasons = sorted(numeric_reasons, key=lambda x: abs(x['shap_value']), reverse=True)
        
        # Build categorical churn-rate insights
        categorical_reasons = []
        warning_threshold = overall_churn + 0.05  # 5% above average churn rate
        protection_threshold = overall_churn - 0.05  # 5% below average churn rate
        
        for col in cat_cols:
            if col in row_df.columns:
                val = row_df[col].iat[0]
                if val in churn_rate[col]:
                    rate = churn_rate[col][val]
                    
                    # Flag if category significantly differs from overall churn rate
                    if rate > warning_threshold:
                        categorical_reasons.append({
                            'feature': col,
                            'value': val,
                            'churn_rate': round(rate, 3),
                            'average_rate': round(overall_churn, 3),
                            'impact': 'negative',
                            'explanation': f"{col}='{val}' has {round(rate*100, 1)}% historical churn rate (vs {round(overall_churn*100, 1)}% average)"
                        })
                    elif rate < protection_threshold:
                        categorical_reasons.append({
                            'feature': col,
                            'value': val,
                            'churn_rate': round(rate, 3),
                            'average_rate': round(overall_churn, 3),
                            'impact': 'positive',
                            'explanation': f"{col}='{val}' has low {round(rate*100, 1)}% historical churn rate (vs {round(overall_churn*100, 1)}% average)"
                        })
        
        # Sort by impact - show negatives (risks) first
        categorical_reasons = sorted(categorical_reasons, key=lambda x: x['churn_rate'], reverse=True)
        
        # Prepare summary insights
        if predictions[i] == 1:  # If churn predicted
            insight_summary = "Customer may leave"
        else:
            insight_summary = "Customer will likely stay"
            
        # Add to results
        result = {
            'prediction': int(predictions[i]),
            'probability': round(float(probabilities[i]), 3),
            'insight_summary': insight_summary,
            'numeric_insights': numeric_reasons,
            'categorical_insights': categorical_reasons
        }
        results.append(result)
    
    return results

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    
    # Define expected columns and build DataFrame
    columns = [
        'SeniorCitizen', 'MonthlyCharges', 'TotalCharges', 'gender', 'Partner', 'Dependents',
        'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
        'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies', 'Contract',
        'PaperlessBilling', 'PaymentMethod', 'tenure'
    ]
    input_df = pd.DataFrame([data], columns=columns)
    
    # Process using the common function
    results = process_customer_data(input_df)
    
    # Add more detailed insight summary for single prediction
    result = results[0]
    if result['prediction'] == 1:  # If churn predicted
        result['insight_summary'] = "Top factors suggesting this customer may leave:"
    else:
        result['insight_summary'] = "Top factors suggesting this customer will stay:"
    
    return jsonify(result)

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    # Check if file is a CSV
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'File must be a CSV'}), 400
    
    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Read the CSV
        input_df = pd.read_csv(filepath)
        
        # Check required columns
        required_columns = [
            'SeniorCitizen', 'MonthlyCharges', 'TotalCharges', 'gender', 'Partner', 'Dependents',
            'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
            'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies', 'Contract',
            'PaperlessBilling', 'PaymentMethod', 'tenure'
        ]
        
        missing_columns = [col for col in required_columns if col not in input_df.columns]
        if missing_columns:
            return jsonify({
                'error': f'Missing required columns: {", ".join(missing_columns)}'
            }), 400
            
        # Process the data
        results = process_customer_data(input_df)
        
        # Create enhanced DataFrame with results
        original_df = input_df.copy()
        
        # Add prediction columns
        original_df['Churn_Prediction'] = [r['prediction'] for r in results]
        original_df['Churn_Probability'] = [r['probability'] for r in results]
        original_df['Churn_Label'] = ['Yes' if p == 1 else 'No' for p in original_df['Churn_Prediction']]
        original_df['Insight_Summary'] = [r['insight_summary'] for r in results]
        
        # Add numeric insights (take top insight only)
        original_df['Top_Numeric_Factor'] = [
            r['numeric_insights'][0]['explanation'] if r['numeric_insights'] else 'No significant numeric factors'
            for r in results
        ]
        
        # Add categorical insights (take top insight only)
        original_df['Top_Categorical_Factor'] = [
            r['categorical_insights'][0]['explanation'] if r['categorical_insights'] else 'No significant categorical factors'
            for r in results
        ]
        
        # Create a CSV in memory
        output = io.BytesIO()
        original_df.to_csv(output, index=False)
        output.seek(0)
        
        # Clean up the uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)
            
        # Return the result file
        return send_file(
            output,
            mimetype='text/csv',
            as_attachment=True,
            download_name='churn_predictions.csv'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- Model training function for retraining ---
def train_model(dataset_path, model_save_path=None):
    """Train a new model on the provided dataset"""
    try:
        # Load data
        df = pd.read_csv(dataset_path)
        
        # Check for customerID column and drop it if present
        if 'customerID' in df.columns:
            df = df.drop('customerID', axis=1)
        
        # Check for Unnamed columns and drop them
        unnamed_cols = [col for col in df.columns if 'Unnamed' in col]
        if unnamed_cols:
            df = df.drop(unnamed_cols, axis=1)
        
        # Verify Churn column exists
        if 'Churn' not in df.columns:
            return {
                'success': False,
                'error': "Dataset must contain a 'Churn' column"
            }
        
        # Convert Churn to binary if it's not (Yes/No to 1/0)
        if df['Churn'].dtype == 'object':
            df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})
        
        # Features and Target
        X = df.drop('Churn', axis=1)
        y = df['Churn']
        
        # Check class balance
        class_counts = y.value_counts()
        class_balance = min(class_counts) / max(class_counts)
        is_balanced = class_balance >= 0.8  # Threshold for "balanced enough"
        
        # Identify categorical and numerical columns
        categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
        numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
        
        # Preprocessing
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), numerical_cols),
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
            ]
        )
        
        # Build the Pipeline
        if is_balanced:
            model_pipeline = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('classifier', RandomForestClassifier(
                    n_estimators=100,
                    criterion='gini',
                    random_state=100,
                    max_depth=6,
                    min_samples_leaf=8
                ))
            ])
        else:
            model_pipeline = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('sampler', SMOTEENN()),
                ('classifier', RandomForestClassifier(
                    n_estimators=100,
                    criterion='gini',
                    random_state=100,
                    max_depth=6,
                    min_samples_leaf=8
                ))
            ])
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train
        training_start = time.time()
        model_pipeline.fit(X_train, y_train)
        training_time = time.time() - training_start
        
        # Evaluate
        y_pred = model_pipeline.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        
        # Save the complete pipeline if path provided
        if model_save_path:
            joblib.dump(model_pipeline, model_save_path)
        
        # Return metrics
        return {
            'success': True,
            'metrics': {
                'accuracy': round(accuracy, 4),
                'precision': round(precision, 4),
                'recall': round(recall, 4),
                'f1': round(f1, 4),
                'training_time': round(training_time, 2),
                'class_balance': round(class_balance, 2),
                'is_balanced': is_balanced,
                'rows': len(df),
                'features': len(X.columns)
            },
            'model': model_pipeline  # Return the model object
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/retrain-model', methods=['POST'])
def retrain_model():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({'success': False, 'error': 'File must be a CSV'}), 400

    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Train a new model on the new dataset
        new_model_path = os.path.join(MODEL_FOLDER, 'retrained_model.joblib')
        result = train_model(filepath, new_model_path)
        
        if not result['success']:
            return jsonify(result), 400
        
        # Prepare for retrained model evaluation on new dataset
        try:
            df_new = pd.read_csv(filepath)
            if 'customerID' in df_new.columns:
                df_new = df_new.drop('customerID', axis=1)
            unnamed_cols = [col for col in df_new.columns if 'Unnamed' in col]
            if unnamed_cols:
                df_new = df_new.drop(unnamed_cols, axis=1)
            if 'Churn' not in df_new.columns:
                return jsonify({'success': False, 'error': "Dataset must contain a 'Churn' column"}), 400
            if df_new['Churn'].dtype == 'object':
                df_new['Churn'] = df_new['Churn'].map({'Yes': 1, 'No': 0})
            
            X_new = df_new.drop('Churn', axis=1)
            y_new = df_new['Churn']
            
            retrained_model = joblib.load(new_model_path)
            y_pred_new = retrained_model.predict(X_new)
            new_metrics = {
                'accuracy': round(accuracy_score(y_new, y_pred_new), 4),
                'precision': round(precision_score(y_new, y_pred_new), 4),
                'recall': round(recall_score(y_new, y_pred_new), 4),
                'f1': round(f1_score(y_new, y_pred_new), 4),
                'training_time': result['metrics'].get('training_time', None)
            }
        except Exception as e:
            new_metrics = {'error': f"Error evaluating retrained model: {str(e)}"}
        
        # Evaluate original model on its original dataset split
        try:
            # Load the original full dataset
            df_orig = pd.read_csv("C:/coading/.vscode/minor-project/Backend/tel_churn.csv")
            
            if 'customerID' in df_orig.columns:
                df_orig = df_orig.drop('customerID', axis=1)
            unnamed_cols = [col for col in df_orig.columns if 'Unnamed' in col]
            if unnamed_cols:
                df_orig = df_orig.drop(unnamed_cols, axis=1)
            if 'Churn' not in df_orig.columns:
                raise ValueError("Original dataset must contain 'Churn' column")
            if df_orig['Churn'].dtype == 'object':
                df_orig['Churn'] = df_orig['Churn'].map({'Yes': 1, 'No': 0})
            
            X = df_orig.drop('Churn', axis=1)
            y = df_orig['Churn']
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            original_model = pickle.load(open("model_pipeline.sav", "rb"))
            y_pred_original = original_model.predict(X_test)
            original_metrics = {
                'accuracy': round(accuracy_score(y_test, y_pred_original), 4),
                'precision': round(precision_score(y_test, y_pred_original), 4),
                'recall': round(recall_score(y_test, y_pred_original), 4),
                'f1': round(f1_score(y_test, y_pred_original), 4)
            }
        except Exception as e:
            original_metrics = {
                'error': f"Error evaluating original model: {str(e)}"
            }

        if os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({
            'success': True,
            'new_model': new_metrics,
            'original_model': original_metrics
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/set-active-model', methods=['POST'])
def set_active_model():
    data = request.get_json(force=True)
    
    if 'model' not in data or data['model'] not in ['original', 'retrained']:
        return jsonify({'success': False, 'error': 'Invalid model selection'}), 400
    
    model_choice = data['model']
    
    
    if model_choice == 'retrained':
        retrained_path = os.path.join(MODEL_FOLDER, 'retrained_model.joblib')
        if not os.path.exists(retrained_path):
            return jsonify({
                'success': False, 
                'error': 'No retrained model available. Please train a new model first.'
            }), 400
    
    # Save the choice
    with open(ACTIVE_MODEL_PATH, 'w') as f:
        f.write(model_choice)
    
    # Refresh the model components
    refresh_model_components()
    
    return jsonify({'success': True, 'active_model': model_choice})

@app.route('/get-active-model', methods=['GET'])
def get_active_model():
    try:
        with open(ACTIVE_MODEL_PATH, 'r') as f:
            active_model = f.read().strip()
        
        # Check if both models exist and get their timestamps
        original_exists = os.path.exists('model_pipeline.sav')
        original_time = os.path.getmtime('model_pipeline.sav') if original_exists else None
        
        retrained_path = os.path.join(MODEL_FOLDER, 'retrained_model.joblib')
        retrained_exists = os.path.exists(retrained_path)
        retrained_time = os.path.getmtime(retrained_path) if retrained_exists else None
        
        return jsonify({
            'success': True,
            'active_model': active_model,
            'models': {
                'original': {
                    'exists': original_exists,
                    'last_modified': original_time
                },
                'retrained': {
                    'exists': retrained_exists,
                    'last_modified': retrained_time
                }
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)