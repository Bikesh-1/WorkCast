import { Router } from "express";
import { 
    loginUser, 
    loggedOut, 
    registerUser, 
    getCurrentUser, 
    updateUserProfile,
    predictUnemploymentRate,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import axios from "axios";
import { spawn } from "child_process";
import path from "path";
import { User } from "../models/user.model.js"; // adjust the path if needed

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, loggedOut);

router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/predict-unemployment").post(verifyJWT, predictUnemploymentRate);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);

// Forward prediction request to external service
router.route("/predict").post(async (req, res) => {
  try {
    const response = await axios.post("https://unemployment-analyzer.onrender.com/predict", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while making the prediction." });
  }
});

// Resume Analysis
router.route("/analyze-resume").post(async (req, res) => {
  const { resume_text } = req.body;
  if (!resume_text) return res.status(400).json({ error: "No resume text provided." });

  try {
    const response = await axios.post("https://resume-analyzer-fszg.onrender.com/predict", {
      resume_text
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error in resume analysis route:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "An error occurred during resume analysis." });
  }
});

// Recommendations
// Recommendations Route
router.get("/recommendations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const top_n = req.query.top_n || 5;
  
      console.log("Fetching recommendations for userId:", userId, "top_n:", top_n);
  
      // Look up MongoDB user by _id
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: `User ${userId} not found in DB.` });
      }
  
      if (!user.recommenderId) {
        return res.status(400).json({ error: "User does not have a recommenderId" });
      }
  
      // Call external WorkCast API with recommenderId
      const response = await axios.get(
        `https://workcast-qizn.onrender.com/recommendations/${user._id}?top_n=${top_n}`
      );
  
      res.status(200).json(response.data);
  
    } catch (error) {
      console.error("Recommendation fetch error:", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        message: "Failed to fetch recommendations",
        error: error.response?.data || error.message,
      });
    }
  });
export default router;
