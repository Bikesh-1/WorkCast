import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const SALT_ROUNDS = 10;

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

// Registration , Signup function 
const registerUser = asyncHandler(async(req,res)=>{
    const {fullName, email, username, password} = req.body
    if(
        [fullName, email, username, password].some((Field)=> Field?.trim()==="")
    )
    {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        fullName,
        email,
        username,
        password,
    })

    if(!user){
        throw new ApiError(500, "Something went wrong while registring the user")
    }

    // After creating the user, generate tokens to log them in
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "User registered successfully")
    )
})

// Login User
const loginUser = asyncHandler(async(req, res)=>{
    const {email, password, username} = req.body;
    console.log(email);
    if(!username && !email){
        throw new ApiError(400, "Username or email is required")
    }
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user cradentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})
// Logged Out User 
const loggedOut = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

// Get Current User

const getCurrentUser = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404, "User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetch Successfully"));
})

// Update user profile
const updateUserProfile = asyncHandler(async(req, res)=>{
    const {fullName, dob, qualification, skills, collegeName, branch, experienceYears, pastExperience} = req.body

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                fullName,
                dob,
                qualification,
                skills,
                collegeName,
                branch,
                experienceYears,
                pastExperience
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404, "User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, user, "profile update successfully"))
})

const predictUnemploymentRate = asyncHandler(async (req, res) => {
    const {
        Region,
        Date,
        Frequency,
        EstimatedEmployed,
        EstimatedLabourParticipationRate,
        Area
    } = req.body;

    if (!Region || !Date || !Frequency) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    try {
        const pythonApiResponse = await axios.post('https://unemployment-analyzer.onrender.com', {
            'Region': Region,
            'Date': Date,
            'Frequency': Frequency,
            'Estimated Employed': EstimatedEmployed,
            'Estimated Labour Participation Rate': EstimatedLabourParticipationRate,
            'Area': Area
        });

        const predictionResult = pythonApiResponse.data.prediction;

        return res.status(200).json(
            new ApiResponse(
                200,
                { prediction: predictionResult },
                "Prediction successful"
            )
        );

    } catch (error) {
        console.error("Error calling prediction service:", error.message);
        throw new ApiError(500, "Failed to get prediction from AI service.");
    }
});



export {
    registerUser,
    generateAccessAndRefereshTokens,
    loginUser,
    loggedOut,
    getCurrentUser,
    updateUserProfile,
    predictUnemploymentRate
}