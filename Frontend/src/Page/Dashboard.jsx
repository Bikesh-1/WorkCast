import React, { useState } from 'react';
import PredictionModal from '../Component/PredictionModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome to your dashboard!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700">Analytics</h2>
                <p className="mt-2 text-gray-600">View your key metrics and performance indicators.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700">Reports</h2>
                <p className="mt-2 text-gray-600">Access and download your generated reports.</p>
              </div>
              {/* Predictor Card */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700">Unemployment Predictor</h2>
                <p className="mt-2 text-gray-600">Click the button to predict the unemployment rate.</p>
                <button
                  onClick={handleOpenModal}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Predict
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PredictionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Dashboard;