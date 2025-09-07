import React, { useState } from 'react';
import axios from 'axios';

const PredictionModal = ({ isOpen, onClose, onPrediction }) => {
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
  const [loading, setLoading] = useState(false);

  // Dropdown options
  const ageGroups = [
    '18-25',
    '26-35',
    '36-45',
    '46-55',
    '56+'
  ];

  const sectors = [
    'IT and Tech', 'Healthcare', 'Construction', 'Finance', 'Education', 'Retail',
    'Agriculture', 'Hospitality', 'Marketing', 'Legal', 'Transportation',
    'Manufacturing', 'Creative Arts'
  ];

  const skillsets = [
    'Data Science', 'Cybersecurity', 'Cloud Computing', 'Machine Learning',
    'Software Development', 'Web Development', 'Nursing', 'Medical Assisting',
    'Pharmacology', 'Physical Therapy', 'Radiology', 'Lab Technician', 'Welding',
    'Carpentry', 'Heavy Equipment Operation', 'Masonry', 'Plumbing', 'Electrical Work',
    'Financial Analysis', 'Accounting', 'Auditing', 'Investment Banking',
    'Actuarial Science', 'Teaching', 'Curriculum Development', 'School Administration',
    'Corporate Training', 'Sales', 'Customer Service', 'Inventory Management',
    'Merchandising', 'Crop Management', 'Livestock Farming', 'Agribusiness',
    'Horticulture', 'Culinary Arts', 'Hotel Management', 'Event Planning',
    'Front Desk Services', 'Digital Marketing', 'Market Research', 'SEO',
    'Content Creation', 'Paralegal', 'Legal Assistant', 'Corporate Law',
    'Criminal Law', 'Logistics Management', 'Truck Driving', 'Warehouse Operations',
    'Robotics', 'Quality Control', 'Supply Chain Management', 'Graphic Design',
    'Video Production', 'Photography', 'Copywriting'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'https://workcast-bxn0.onrender.com/api/v1/users/predict',
        formData
      );
      setPrediction(response.data.predicted_probability);
      setError('');
      if (onPrediction) {
        onPrediction(response.data.predicted_probability);
      }
    } catch (err) {
      setError('An error occurred while making the prediction.');
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictAgain = () => {
    setPrediction(null);
    setError('');
    setFormData({
      Age_Group: '',
      Gender: '',
      Education: '',
      Skillset: '',
      Sector: '',
      Location: '',
      Experience: '',
      Employment_History: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-neutral-900 text-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-neutral-800 relative flex flex-col md:flex-row gap-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Left side - Form / Results */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-6 text-center md:text-left tracking-tight">
            Unemployment Prediction
          </h2>

          {prediction === null ? (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Age Group Dropdown */}
              <select
                name="Age_Group"
                value={formData.Age_Group}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
              >
                <option value="">Select Age Group</option>
                {ageGroups.map((age, idx) => (
                  <option key={idx} value={age}>
                    {age}
                  </option>
                ))}
              </select>

              {/* Gender Dropdown */}
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              {/* Education (free text) */}
              <input
                type="text"
                name="Education"
                placeholder="Education"
                value={formData.Education}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-neutral-400 text-white transition"
              />

              {/* Skillset Dropdown */}
              <select
                name="Skillset"
                value={formData.Skillset}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
              >
                <option value="">Select Skillset</option>
                {skillsets.map((skill, idx) => (
                  <option key={idx} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>

              {/* Sector Dropdown */}
              <select
                name="Sector"
                value={formData.Sector}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
              >
                <option value="">Select Sector</option>
                {sectors.map((sector, idx) => (
                  <option key={idx} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>

              {/* Location */}
              <input
                type="text"
                name="Location"
                placeholder="Location"
                value={formData.Location}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-neutral-400 text-white transition"
              />

              {/* Experience */}
              <input
                type="number"
                name="Experience"
                placeholder="Experience (in years)"
                value={formData.Experience}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-neutral-400 text-white transition"
              />

              {/* Employment History */}
              <input
                type="text"
                name="Employment_History"
                placeholder="Employment History"
                value={formData.Employment_History}
                onChange={handleChange}
                className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-neutral-400 text-white transition"
              />

              {/* Submit button */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white p-3 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition"
                  disabled={loading}
                >
                  {loading ? 'Predicting...' : 'Predict'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-6 p-6 bg-gradient-to-r from-green-700 to-green-500 rounded-lg text-white shadow-inner text-center w-full">
                <p className="font-bold text-lg">
                  Predicted Unemployment Probability:
                </p>
                <p className="text-3xl font-mono mt-2">
                  {(prediction * 100).toFixed(2)}%
                </p>
              </div>
              <button
                onClick={handlePredictAgain}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
              >
                Predict Again
              </button>
            </div>
          )}
        </div>

        {/* Right side - Errors + Close */}
        <div className="flex-1 flex flex-col justify-center">
          {error && (
            <div className="mb-6 p-6 bg-gradient-to-r from-red-700 to-red-500 rounded-lg text-white shadow-inner text-center">
              <p className="font-bold">{error}</p>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-lg font-semibold hover:bg-neutral-700 transition mt-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;
