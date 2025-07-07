from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

# Enable CORS (to allow React frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load("diabetes_model.pkl")
scaler = joblib.load("scaler.pkl")

# Define expected input structure
class DiabetesInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float

@app.post("/predict")
def predict_diabetes(data: DiabetesInput):
    input_array = np.array([[data.Pregnancies, data.Glucose, data.BloodPressure,
                             data.SkinThickness, data.Insulin, data.BMI,
                             data.DiabetesPedigreeFunction, data.Age]])

    scaled_input = scaler.transform(input_array)
    prediction = model.predict(scaled_input)

    return {
        "prediction": int(prediction[0]),
        "status": "Diabetic" if prediction[0] == 1 else "Non-Diabetic"
    }
