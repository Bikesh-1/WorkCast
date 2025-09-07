// Frontend/src/Component/UnemploymentPredictor.jsx
import React, { useState } from 'react';

function UnemploymentPredictor() {
  const [formData, setFormData] = useState({
    Region: 'Andhra Pradesh',
    Date: '2020-01-31',
    Frequency: 'Monthly',
    EstimatedEmployed: 11999139,
    EstimatedLabourParticipationRate: 43.24,
    Area: 'Rural',
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    try {
      const response = await fetch('/api/v1/users/predict-unemployment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           // You'll need to include your auth token here
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction request failed');
      }

      const result = await response.json();
      setPrediction(result.data.prediction);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Predict Unemployment Rate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Add form inputs for each field like 'Region', 'Date', etc. */}
        {/* This is a simplified example. You'd want to create proper inputs. */}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Predict
        </button>
      </form>
      {prediction !== null && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="font-bold">Predicted Unemployment Rate: {prediction.toFixed(4)}%</p>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default UnemploymentPredictor;