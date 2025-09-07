import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import PredictionModal from '../Component/PredictionModal';
import ResumeModal from '../Component/ResumeModal';
import RecommendedCourses from '../Component/RecommendedCourses';

function Dashboard() {
  const { user, logout } = useAppContext();

  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [recommendationError, setRecommendationError] = useState('');

  const userName = user?.fullName || user?.username || "User";
  const userEmail = user?.email || "No email available";
  const userUsername = user?.username || "N/A";
  const userProfileImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?._id) {
        setLoadingRecommendations(false);
        setRecommendationError("No user logged in");
        return;
      }

      setLoadingRecommendations(true);
      setRecommendationError('');

      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/recommendations/${user._id}?top_n=5`
        );

        if (!response.ok) {
          const rawError = await response.text();
          console.error("Raw error response:", rawError);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          setRecommendationError(data.error);
          setRecommendations([]);
        } else {
          setRecommendations(data.recommendations || data.data || []);
        }

      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendationError(error.message || "Failed to fetch recommendations");
        setRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleResumeResult = (data) => {
    setResumeResult(data);
    setIsResumeModalOpen(false);
  };

  const handlePredictionResult = (data) => {
    setPredictionResult(data);
    setIsPredictionOpen(false);
  };

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Navbar */}
      <nav className="flex sticky top-0 z-40 justify-between items-center px-8 py-4 w-full shadow-lg bg-zinc-900">
        <div className="flex items-center">
          <a href="/"><img src="https://ik.imagekit.io/lxvqyrkjo/Group%201.svg" alt="WorkCast Logo" className="w-auto h-12" /></a>
        </div>
        <div className="flex gap-4 items-center">
          <img src={userProfileImg} alt="User Profile" className="object-cover w-10 h-10 rounded-full border-2 border-indigo-500" />
          <button onClick={handleLogout} className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg transition-transform transform hover:bg-indigo-700 hover:scale-105">Logout</button>
        </div>
      </nav>

      {/* Dashboard Body */}
      <main className="flex flex-col md:flex-row min-h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <aside className="flex flex-col justify-between items-center self-start p-8 m-8 w-full rounded-2xl shadow-lg md:w-1/4 bg-zinc-900">
          <div className="flex flex-col items-center w-full text-center">
            <img src={userProfileImg} alt="User Profile" className="object-cover mb-4 w-24 h-24 rounded-full border-4 border-indigo-500" />
            <h2 className="mb-1 text-xl font-bold">{userName}</h2>
            <p className="mb-1 text-sm text-gray-400 break-all">{userEmail}</p>
            <p className="mb-6 text-sm text-gray-400">Username: <span className="font-mono">{userUsername}</span></p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button onClick={() => setIsResumeModalOpen(true)} className="px-4 py-2 w-full font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700">Analyze Resume</button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Unemployment Risk */}
            <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[220px]">
              <h3 className="mb-4 text-lg font-semibold">Unemployment Risk</h3>
              <button onClick={() => setIsPredictionOpen(true)} className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow transition hover:from-blue-700 hover:to-blue-500">Predict Risk</button>
              {predictionResult !== null && (
                <div className="mt-4 text-center">
                  <p className="mt-2 text-2xl font-bold text-gray-300">{(predictionResult * 100).toFixed(2)}%</p>
                  <p className="text-sm text-gray-500">Estimated Risk</p>
                </div>
              )}
            </div>

            {/* Resume Analysis */}
            <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 min-h-[220px]">
              <h3 className="mb-2 text-lg font-semibold">Resume Analysis</h3>
              {resumeResult ? <p className="text-2xl font-bold whitespace-pre-wrap text-[green]">{resumeResult}</p> : <span className="text-gray-500">Analyze your resume to see insights here.</span>}
            </div>

            {/* Recommended Courses */}
            <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 min-h-[220px]">
              <h3 className="mb-2 text-lg font-semibold">Recommended Courses For You</h3>
              {recommendationError ? (
                <p className="text-red-400">{recommendationError}</p>
              ) : (
                <RecommendedCourses recommendations={recommendations} loading={loadingRecommendations} />
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} onResult={handleResumeResult} />
      <PredictionModal isOpen={isPredictionOpen} onClose={() => setIsPredictionOpen(false)} onPrediction={handlePredictionResult} />
    </div>
  );
}

export default Dashboard;
