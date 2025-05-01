# 🧠 Customer Churn Prediction Platform

A full-stack, user-centric machine learning platform to predict customer churn with deep insights, model customization, and educational resources.

Built using **React**, **Flask**, and **Scikit-learn**, this app enables real-time and batch predictions, lets users train custom models, and explains predictions using SHAP and business logic visualizations.

---

## 🚀 Features

### 1. 🔍 Single Customer Prediction
- Fill out a form with customer details
- Get churn prediction in real time
- Visual insights using SHAP values and business logic explanations (via Recharts)

### 2. 📂 Batch Prediction
- Upload a CSV of multiple customers
- Download CSV with churn predictions and probability scores

### 3. 🧠 Model Manager
- Upload your own dataset to train a custom model
- Compare performance with the base model (Random Forest)
- Choose the preferred model for future predictions

### 4. 🏠 Home (Knowledge Hub)
- Short guides, tooltips, and explanations of churn concepts
- FAQs and actionable strategies based on predictions
- Use case examples and optional guided tour

---

## 🛠️ Tech Stack

- **Frontend**: React + Recharts (for visualizations)
- **Backend**: Flask (REST API)
- **ML Pipeline**: 
  - Random Forest Classifier
  - SHAP for explainability
  - Business logic rule engine
  - Data balancing (SMOTEENN)
  - Data cleaning & preprocessing
- **Other Tools**: Pandas, Scikit-learn, Imbalanced-learn

---

## 📸 Preview


- Single prediction with insights  
  ![image](https://github.com/user-attachments/assets/4a3e6b0c-109a-4080-8acf-8ea737d2eac0)

  ![image](https://github.com/user-attachments/assets/a14ba4ce-b9b3-400b-bb57-f46e4cec0ac5)

  ![image](https://github.com/user-attachments/assets/01b69f5a-385d-4dea-9220-cb2dfd728b70)



- Batch prediction result
  ![Screenshot 2025-04-30 221323](https://github.com/user-attachments/assets/131f1ae6-37ec-4992-98a2-354569a461db)
  
  ![image](https://github.com/user-attachments/assets/f324dc43-be54-4fce-80e1-992739168534)

  ![image](https://github.com/user-attachments/assets/8807fd86-6e0b-4bfa-8eea-a5248757979a)

  ![image](https://github.com/user-attachments/assets/9a8cc666-b3ed-434a-986f-febe56dced17)



- Model training & comparison  
  ![image](https://github.com/user-attachments/assets/5e7d5db1-670f-4406-b301-3184c098e706)

  ![image](https://github.com/user-attachments/assets/19d913b7-b2ae-4e99-b7a7-859e7622cc0f)

  ![image](https://github.com/user-attachments/assets/ca2c34b0-22b5-455e-a0c8-902333a2e93d)

  ![image](https://github.com/user-attachments/assets/93925a4f-e65e-4926-91a1-737675a867f9)

  ![image](https://github.com/user-attachments/assets/38cd58e2-34b4-49d3-a452-fc87c81ffa72)






###- Knowledge Hub interface  
  ![image](https://github.com/user-attachments/assets/d2ead0e0-b0af-4952-8626-1ffcc20c7aa9)

  ![image](https://github.com/user-attachments/assets/9694e7f9-22dd-457e-8d1d-7465f79f8a77)

  ![image](https://github.com/user-attachments/assets/77056e8a-dd76-48ef-8f92-ad73ed114dbf)

  ![image](https://github.com/user-attachments/assets/e056c349-4b4a-451e-a6e0-482f8116a351)

  ![image](https://github.com/user-attachments/assets/d270b5e1-7020-4fc7-92cd-269bc5d0191f)

  ![image](https://github.com/user-attachments/assets/250c294a-5c87-496a-b6ce-886611bddbce)



---

## 📊 ML Model Info

- **Default Model**: Trained on original dataset with Random Forest
- **Custom Model Support**: Upload CSV to retrain
- **Balancing**: SMOTEENN for class imbalance
- **Explainability**: SHAP + Business logic
- **Comparison Metrics**: Accuracy, Precision, Recall, F1-Score

---

## 📚 Knowledge Hub Includes

- What is Churn?
- How does our model work?
- How to interpret predictions?
- Business actions to reduce churn
- FAQs and example use cases

---

## 🧪 How to Run Locally

### Frontend (React)
```bash
cd frontend
npm i
npm run dev
```
### Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```
## 📄 License

MIT License — feel free to use, fork, and contribute!

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 🙌 Acknowledgements

Thanks to the open-source community for tools like SHAP, SMOTEENN, and Recharts and Kaggle for providing dataset.


---


