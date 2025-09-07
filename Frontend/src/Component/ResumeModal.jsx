import React, { useState } from 'react';
import axios from 'axios';

const ResumeModal = ({ isOpen, onClose, onResult }) => {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextChange = (event) => {
    setResumeText(event.target.value);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste your resume text into the field.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/users/analyze-resume',
        { resume_text: resumeText }
      );

      const category = response.data.predicted_category;
      setResult(category);

      // 🔥 Send result back to Dashboard
      if (onResult) {
        onResult(category);
      }
    } catch (err) {
      setError('An error occurred while analyzing the resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setResumeText('');
    setResult(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black text-white p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Resume Analyzer</h2>

        {!result ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="resume-text"
              >
                Paste your resume text below
              </label>
              <textarea
                id="resume-text"
                value={resumeText}
                onChange={handleTextChange}
                className="w-full h-48 p-2 border border-gray-700 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste your full resume text here..."
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs italic mb-4">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="p-4 bg-green-900 border-l-4 border-green-500 text-green-200">
              <p className="font-bold">Predicted Resume Category:</p>
              <p className="text-xl">{result}</p>
            </div>
            <button
              onClick={handleAnalyzeAnother}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Analyze Another
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-300 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ResumeModal;
