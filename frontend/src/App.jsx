import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/predict', {
        ...Object.fromEntries(
          Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
        )
      });
      setResult(res.data);
      setShowPopup(true);
    } catch (error) {
      console.error('Prediction error:', error);
    }
    setLoading(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="container">
        <h1>Diabetes Predictor</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div key={field} className="form-group">
              <label>{field}</label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                step="any"
              />
            </div>
          ))}
          <button type="submit" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </form>
      </div>

      {/* Popup for result */}
      {showPopup && result && (
        <div className="popup-overlay">
          <div className={`popup ${result.prediction === 1 ? 'positive' : 'negative'}`}>
            <div className="popup-close" onClick={closePopup}>×</div>
            <p>{result.status}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
