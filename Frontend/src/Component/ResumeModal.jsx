import React, { useState } from 'react';
import axios from 'axios';

const ResumeModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a resume file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.predicted_category);
    } catch (err) {
      setError('An error occurred while analyzing the resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setSelectedFile(null);
    setResult(null);
    setError('');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Resume Analyzer</h2>

        {!result ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume-upload">
                Upload your resume (PDF or DOCX)
              </label>
              <input
                id="resume-upload"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.docx"
              />
            </div>

            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p className="font-bold">Predicted Resume Category:</p>
              <p className="text-xl">{result}</p>
            </div>
             <button
                onClick={handleAnalyzeAnother}
                className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Analyze Another
              </button>
          </div>
        )}

        <button onClick={onClose} className="mt-4 text-sm text-gray-600 hover:text-gray-800">
          Close
        </button>
      </div>
    </div>
  );
};

export default ResumeModal;
