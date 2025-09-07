import { Router } from "express";
import { 
    loginUser, 
    loggedOut, 
    registerUser, 
    getCurrentUser, 
    updateUserProfile,
    predictUnemploymentRate,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import axios from "axios";
// import FormData from 'form-data';

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, loggedOut);


router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/predict-unemployment").post(verifyJWT, predictUnemploymentRate);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);
router.route("/predict").post(async (req, res) => {
    try {
        const response = await axios.post("https://unemployment-analyzer.onrender.com/predict", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while making the prediction." });
    }
});
router.route("/analyze-resume").post(async (req, res) => { // Removed upload.single('resume')
    const { resume_text } = req.body; // Get resume_text from the JSON body
    if (!resume_text) {
        return res.status(400).json({ error: "No resume text provided." });
    }

    try {
        // Forward the JSON payload directly to the Python service
        const response = await axios.post("https://resume-analyzer-fszg.onrender.com/predict", {
             resume_text: resume_text
        });
        res.json(response.data);
    } catch (error) {
        // Log the detailed error from the python service if available
        console.error("Error in resume analysis route:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "An error occurred during resume analysis." });
    }
});

export default router;