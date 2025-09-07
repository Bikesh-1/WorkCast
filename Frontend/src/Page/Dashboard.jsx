import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import PredictionModal from '../Component/PredictionModal';
import ResumeModal from '../Component/ResumeModal';

function Dashboard() {
  const { user, logout } = useAppContext();
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Store results
  const [predictionResult, setPredictionResult] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);

  // User info
  const userName = user?.fullName || user?.username || "User";
  const userEmail = user?.email || "No email";
  const userUsername = user?.username || "No username";
  const userProfileImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=0D8ABC&color=fff`;

  // Handlers
  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleOpenResumeModal = () => setIsResumeModalOpen(true);
  const handleCloseResumeModal = () => setIsResumeModalOpen(false);

  const openPredictionModal = () => setIsPredictionOpen(true);
  const closePredictionModal = () => setIsPredictionOpen(false);

  // Callbacks from modals
  const handleResumeResult = (data) => {
    setResumeResult(data);
    setIsResumeModalOpen(false);
  };

  const handlePredictionResult = (data) => {
    setPredictionResult(data);
    setIsPredictionOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-zinc-900 shadow-md">
        <div className="flex items-center">
          <a href="/">
            <img
              src="https://ik.imagekit.io/lxvqyrkjo/Group%201.svg?updatedAt=1757147618895"
              alt="Logo"
              className="h-12 w-auto"
            />
          </a>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={userProfileImg}
            alt="User Profile"
            className="h-10 w-10 rounded-full border-2 border-indigo-500 object-cover"
          />
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Body */}
      <div className="flex flex-row min-h-[calc(100vh-80px)]">
        {/* Profile Card */}
        <div className="w-full max-w-xs bg-zinc-900 rounded-2xl shadow-lg p-8 m-8 flex flex-col items-center justify-between min-h-[400px]">
          <div className="flex flex-col items-center w-full">
            <img
              src={userProfileImg}
              alt="User Profile"
              className="h-24 w-24 rounded-full border-4 border-indigo-500 object-cover mb-4"
            />
            <h2 className="text-xl font-bold mb-1">{userName}</h2>
            <p className="text-gray-400 text-sm mb-1 break-all">{userEmail}</p>
            <p className="text-gray-400 text-sm mb-4">
              Username: <span className="font-mono">{userUsername}</span>
            </p>
          </div>
          <button
            onClick={handleOpenResumeModal}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Analyze Resume
          </button>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex flex-col p-8">
          <div className="flex flex-row gap-8 mb-8">
            {/* Predict Unemployment Risks Card */}
            <div className="flex-1 bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
              <button
                onClick={openPredictionModal}
                className="mb-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition"
              >
                Predict Unemployment Risk
              </button>
              {predictionResult && (
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold">Prediction Result</h3>
                  <p className="text-gray-300 mt-2 text-lg">{(predictionResult * 100).toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-8">
            {/* Resume Analysis Result */}
            <div className="flex-1 bg-zinc-900 rounded-2xl shadow-lg p-8 min-h-[150px]">
              <h3 className="text-lg font-semibold mb-2">Resume Analysis</h3>
              {resumeResult ? (
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {resumeResult}
                </p>
              ) : (
                <span className="text-gray-500">No analysis yet.</span>
              )}
            </div>

            {/* Recommend Personalized Skilling Courses Card */}
            <div className="flex-1 bg-zinc-900 rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[150px]">
              <span className="text-lg text-center text-gray-200">
                Based on their profiles, recommend personalized skilling courses
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={handleCloseResumeModal}
        onResult={handleResumeResult} // pass callback
      />
      <PredictionModal
        isOpen={isPredictionOpen}
        onClose={closePredictionModal}
        onPrediction={handlePredictionResult} // pass callback
      />
    </div>
  );
}

export default Dashboard;
