import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Page/Home';
import Login from './Page/Login';
import Signup from './Page/Signup';
import Dashboard from './Page/Dashboard';
import Prediction from './Component/PredictionModal';
import { AppProvider, useAppContext } from '../../Frontend/src/context/AppContext';

// A special component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    // While we're checking for a user, show a loading message
    return <div>Loading...</div>;
  }

  if (!user) {
    // If there's no user, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If the user is logged in, show the page they requested
  return children;
};

function App() {
  return (
    <AppProvider>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/predict" element={<Prediction />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      
    </AppProvider>
  );
}

export default App;

