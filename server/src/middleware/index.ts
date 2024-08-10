import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user-model";



export interface AuthRequest extends Request {
    user: string
    userDeviceToken: string
}

export const authenticationMiddleware = async (
    request: AuthRequest,
    response: Response,
    next: NextFunction) => {

    try {
        const { authorization } = request.headers;
        if (!authorization) {
            return response.status(401).json(
                { error: "Authorization is required" }
            );
        }
        const token = authorization
        const { _id } = jwt.verify(token, "express") as { _id: string };
        const existingUser = await User.findOne({ _id });

        if (existingUser) {
            request.user = existingUser.id
        }
        next();


    } catch (error) {
        return response.status(401).send({ message: "Invalid token" });
    }
}