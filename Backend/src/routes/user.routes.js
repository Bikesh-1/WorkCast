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

export default router;