import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import PredictionModal from '../Component/PredictionModal';
import ResumeModal from '../Component/ResumeModal';
import CertificateModal from '../Component/VerifyCertificateModal';
import VerifyCertificateModal from '../Component/VerifyCertificateModal';
import axios from 'axios';

function Dashboard() {
  const { user, logout } = useAppContext();
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isVerifyCertificateModalOpen, setIsVerifyCertificateModalOpen] = useState(false);

  // Store results
  const [predictionResult, setPredictionResult] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [certificates, setCertificates] = useState([]);

  // User info
  const userName = user?.fullName || user?.username || "User";
  const userEmail = user?.email || "No email";
  const userUsername = user?.username || "No username";
  const userProfileImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=0D8ABC&color=fff`;

  useEffect(() => {
    const fetchCertificates = async () => {
      if (user && user.walletAddress) {
        try {
          const response = await axios.get(`https://work-cast.vercel.app/api/v1/certificates/get-certificates?studentWallet=${user.walletAddress}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          setCertificates(response.data.data);
        } catch (error) {
          console.error("Failed to fetch certificates", error);
        }
      }
    };
    fetchCertificates();
  }, [user]);

  // Handlers
  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleOpenResumeModal = () => setIsResumeModalOpen(true);
  const handleCloseResumeModal = () => setIsResumeModalOpen(false);

  const openPredictionModal = () => setIsPredictionOpen(true);
  const closePredictionModal = () => setIsPredictionOpen(false);
  


  const openVerifyCertificateModal = () => setIsVerifyCertificateModalOpen(true);
  const closeVerifyCertificateModal = () => setIsVerifyCertificateModalOpen(false);

  // Callbacks from modals
  const handleResumeResult = (data) => {
    setResumeResult(data);
    setIsResumeModalOpen(false);
  };

  const handlePredictionResult = (data) => {
    setPredictionResult(data);
    setIsPredictionOpen(false);
  };
  
  const handleCertificateIssued = (newCertificate) => {
    setCertificates(prev => [...prev, newCertificate]);
  };

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 w-full shadow-md bg-zinc-900">
        <div className="flex items-center">
          <a href="/">
            <img
              src="https://ik.imagekit.io/lxvqyrkjo/Group%201.svg?updatedAt=1757147618895"
              alt="Logo"
              className="w-auto h-12"
            />
          </a>
        </div>
        <div className="flex gap-4 items-center">
          <img
            src={userProfileImg}
            alt="User Profile"
            className="object-cover w-10 h-10 rounded-full border-2 border-indigo-500"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700"
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
              className="object-cover mb-4 w-24 h-24 rounded-full border-4 border-indigo-500"
            />
            <h2 className="mb-1 text-xl font-bold">{userName}</h2>
            <p className="mb-1 text-sm text-gray-400 break-all">{userEmail}</p>
            <p className="mb-4 text-sm text-gray-400">
              Username: <span className="font-mono">{userUsername}</span>
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={handleOpenResumeModal}
              className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700"
            >
              Analyze Resume
            </button>
            
            <button
              onClick={openVerifyCertificateModal}
              className="px-4 py-2 font-medium text-white bg-yellow-600 rounded-lg transition hover:bg-yellow-700"
            >
              Verify Certificate
            </button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex flex-col flex-1 p-8">
          <div className="flex flex-row gap-8 mb-8">
            {/* Predict Unemployment Risks Card */}
            <div className="flex-1 bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
              <button
                onClick={openPredictionModal}
                className="px-6 py-3 mb-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow transition hover:from-blue-700 hover:to-blue-500"
              >
                Predict Unemployment Risk
              </button>
              {predictionResult && (
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold">Prediction Result</h3>
                  <p className="mt-2 text-lg text-gray-300">{(predictionResult * 100).toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Resume Analysis Result */}
            <div className="p-8 rounded-2xl shadow-lg bg-zinc-900">
              <h3 className="mb-2 text-lg font-semibold">Resume Analysis</h3>
              {resumeResult ? (
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {resumeResult}
                </p>
              ) : (
                <span className="text-gray-500">No analysis yet.</span>
              )}
            </div>

            {/* Recommend Personalized Skilling Courses Card */}
            <div className="p-8 rounded-2xl shadow-lg bg-zinc-900">
              <h3 className="mb-2 text-lg font-semibold">
                Personalized Skilling Courses
              </h3>
              <span className="text-gray-500">
                Recommendations will appear here.
              </span>
            </div>

            {/* Issued Certificates */}
            <div className="p-8 rounded-2xl shadow-lg md:col-span-2 bg-zinc-900">
              <h3 className="mb-4 text-lg font-semibold">My Certificates</h3>
              <div className="space-y-4">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <div key={cert._id} className="p-4 rounded-lg bg-zinc-800">
                      <h4 className="font-bold text-md">{cert.courseName}</h4>
                      <p className="text-sm text-gray-400">Issued by: {cert.institution}</p>
                       <a href={`https://explorer.solana.com/tx/${cert.transactionId}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                        View on Solana Explorer
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No certificates found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={handleCloseResumeModal}
        onResult={handleResumeResult}
      />
      <PredictionModal
        isOpen={isPredictionOpen}
        onClose={closePredictionModal}
        onPrediction={handlePredictionResult}
      />
      
      <VerifyCertificateModal
        isOpen={isVerifyCertificateModalOpen}
        onClose={closeVerifyCertificateModal}
      />
    </div>
  );
}

export default Dashboard;
