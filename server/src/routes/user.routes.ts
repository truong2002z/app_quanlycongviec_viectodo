import express from 'express';
import { changePassword, createUser, forgotPassword, loginUser, updateDeviceToken, updateProfile } from '../controllers/user.controller';
import { authenticationMiddleware } from "../middleware"


const userRoutes = express.Router();


userRoutes.route('/create').post(createUser)
userRoutes.route('/login').post(loginUser)
userRoutes.put("/change-password", authenticationMiddleware as any, changePassword);
userRoutes.put("/update-profile", updateProfile);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post('/update-device-token', updateDeviceToken);

export default userRoutes;