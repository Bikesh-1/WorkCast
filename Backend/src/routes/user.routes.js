import { Router } from "express";
import { 
    loginUser, 
    loggedOut, 
    registerUser, 
    getCurrentUser, 
    updateUserProfile 
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("profilePhoto"),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, loggedOut);


router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-profile").patch(verifyJWT, updateUserProfile);


export default router;