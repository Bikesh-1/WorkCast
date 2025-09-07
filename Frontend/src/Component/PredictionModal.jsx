import React, { useState } from 'react';
import axios from 'axios';

const PredictionModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        Age_Group: '',
        Gender: '',
        Education: '',
        Skillset: '',
        Sector: '',
        Location: '',
        Experience: '',
        Employment_History: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/users/predict', formData);
            setPrediction(response.data.predicted_probability);
            setError('');
        } catch (err) {
            setError('An error occurred while making the prediction.');
            setPrediction(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Unemployment Prediction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="Age_Group" placeholder="Age Group" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="Gender" placeholder="Gender" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="Education" placeholder="Education" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="Skillset" placeholder="Skillset" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="Sector" placeholder="Sector" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="Location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="number" name="Experience" placeholder="Experience (in years)" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="Employment_History" placeholder="Employment History" onChange={handleChange} className="w-full p-2 border rounded" />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Predict</button>
                </form>
                {prediction !== null && (
                    <div className="mt-4 p-4 bg-green-100 rounded">
                        <p className="font-bold">Predicted Unemployment Probability:</p>
                        <p>{prediction.toFixed(4)}</p>
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 rounded">
                        <p className="font-bold text-red-600">{error}</p>
                    </div>
                )}
                <button onClick={onClose} className="mt-4 w-full bg-gray-300 text-black p-2 rounded">Close</button>
            </div>
        </div>
    );
};

export default PredictionModal;