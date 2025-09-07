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
import FormData from 'form-data';

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
router.route("/analyze-resume").post(upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No resume file uploaded." });
    }

    try {
        const form = new FormData();
        form.append('resume', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post("https://resume-analyzer-fszg.onrender.com/predict", form, {
            headers: {
                ...form.getHeaders()
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error in resume analysis route:", error);
        res.status(500).json({ error: "An error occurred during resume analysis." });
    }
});

export default router;