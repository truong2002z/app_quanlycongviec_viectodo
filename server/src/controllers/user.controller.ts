import { Request, Response } from "express";
import User from "../models/user-model";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../types";
import nodemailer from "nodemailer";




const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password,avatar,deviceToken} = request.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return response.status(409).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ 
            name, 
            email, 
            avatar,
            deviceToken ,
            password: hashedPassword });
            response.status(201).send({massage:"User created successfully"});
    } catch (error) {
       console.log("Error creating user", error);
    }
};
const getUserToken = (_id: string|Types.ObjectId) => {
    const authenticatedUserToken =  jwt.sign({ _id }, "express",{
        expiresIn: "7d"
    });
    return authenticatedUserToken;
}


const loginUser = async (request: Request, response: Response) => {
    try {
     const { email, password }: IUser = request.body
     const existingUser = await User.findOne({ email })
     if (!existingUser) {
        return response.status(409).send({ message: "User doesn't exist" })
      }
      const isPasswordIdentical = await bcrypt.compare(
        password,
        existingUser.password
      )

        if(isPasswordIdentical){
            const token = getUserToken(existingUser._id);
            return response.send(
                {
                    token,
                    user: {
                        name: existingUser.name,
                        email: existingUser.email
                    }
                }
            )
        } else {
            return response.status(400).send({message:"Invalid password"});
        }
    } catch (error) {
        console.log("Error logging in user", error);
    }
}


 const updateDeviceToken = async (req: Request, res: Response) => {
    try {
      const { email, deviceToken } = req.body;
      
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await User.findOne(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // So sánh deviceToken mới với giá trị hiện tại
      if (user.deviceToken !== deviceToken) {
        // Cập nhật deviceToken nếu nó khác với giá trị hiện tại
        user.deviceToken = deviceToken;
        await user.save();
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error updating device token:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };



const changePassword = async (request: Request, response: Response) => {
    try {
        const { email, oldPassword, newPassword } = request.body;

        // Tìm người dùng dựa trên email
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return response.status(404).send({ message: "User not found" });
        }

        // Kiểm tra tính hợp lệ của mật khẩu cũ
        const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isPasswordValid) {
            return response.status(400).send({ message: "Invalid old password" });
        }

        // Hash mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        await User.updateOne({ _id: existingUser._id }, { password: hashedNewPassword });

        response.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password", error);
        response.status(500).send({ message: "Error changing password" });
    }
};

const updateProfile = async (request: Request, response: Response) => {
    try {
        const { email, newName, newAvatar  } = request.body;

        // Tìm người dùng dựa trên email
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return response.status(404).send({ message: "User not found" });
        }

        // Cập nhật thông tin mới vào cơ sở dữ liệu
        await User.updateOne({ _id: existingUser._id }, { name: newName, avatar: newAvatar});

        response.status(200).send({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile", error);
        response.status(500).send({ message: "Error updating profile" });
    }
};


const forgotPassword = async (request: Request, response: Response) => {
    try {
        const { email } = request.body;

        // Tìm người dùng dựa trên email
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return response.status(404).send({ message: "User not found" });
        }

        // Tạo mật khẩu ngẫu nhiên
        const randomPassword = Math.random().toString(36).slice(-8); // Tạo mật khẩu 8 ký tự ngẫu nhiên

        // Hash mật khẩu ngẫu nhiên
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        await User.updateOne({ _id: existingUser._id }, { password: hashedPassword });

        // Gửi email chứa mật khẩu ngẫu nhiên cho người dùng
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hoangbinh02022002@gmail.com",
                pass: "dvmb ehpm ceps fban", 
            },
        });

        const mailOptions = {
            from: "hoangbinh02022002@gmail.com",
            to: email,
            subject: "Đặt lại mật khẩu",
            text: `Mật khẩu mới của bạn là: ${randomPassword}\n\n Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
                response.status(500).send({ message: "Error sending email" });
            } else {
                console.log("Email sent:", info.response);
                response.status(200).send({ message: "New password sent to your email" });
            }
        });

    } catch (error) {
        console.error("Error forgot password", error);
        response.status(500).send({ message: "Error forgot password" });
    }
};





export { createUser,loginUser,changePassword,updateProfile,forgotPassword,updateDeviceToken};


