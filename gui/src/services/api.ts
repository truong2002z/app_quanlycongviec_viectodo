import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../types";
import axiosInstance, { TOKEN_NAME, saveToken } from "./config";
import { useEffect, useState } from "react";
import messaging from '@react-native-firebase/messaging';

type RegisterUserTypes = IUser;

export const useDeviceToken = () => {
  const [deviceToken, setDeviceToken] = useState<string>('');

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const token = await messaging().getToken();
      console.log('FCM token:', token);
      setDeviceToken(token);
    };
    requestUserPermission();
  }, []);

  return deviceToken;
};

export const registerUser = async ({
  email,
  name,
  password,
  deviceToken,
}: RegisterUserTypes & { deviceToken: string }) => {
  try {
    const response = await axiosInstance.post("/users/create", {
      email,
      password,
      name,
      deviceToken, // Gửi deviceToken cùng với dữ liệu người dùng
    });
    return response.data.user;
  } catch (error) {
    console.log("error in registerUser", error);
    throw error;
  }
};

type LoginUserTypes = Omit<IUser, "name">;

// export const loginUser = async ({ email, password }: LoginUserTypes) => {
//   try {
//     const response = await axiosInstance.post("/users/login", {
//       email,
//       password,
//     });
//     const _token = response.data.token;
//     axiosInstance.defaults.headers.common["Authorization"] = _token;
//     saveToken(TOKEN_NAME, _token);
//     return response.data.user;
//   } catch (error) {
//     console.log("error in loginUser", error);
//     throw error;
//   }
// };

export const loginUser = async ({ email, password }: LoginUserTypes) => {
  try {
    console.log('Sending login request to /users/login with:', { email, password });

    const response = await axiosInstance.post("/users/login", {
      email,
      password,
    });

    console.log('Login successful:', response.data);

    const _token = response.data.token;
    axiosInstance.defaults.headers.common["Authorization"] = _token;
    saveToken(TOKEN_NAME, _token);

    // Get deviceToken and update for the user
    const deviceToken = await messaging().getToken();
    if (deviceToken) {
      console.log('Updating device token for user:', response.data.user.email, deviceToken);
      
      await axiosInstance.post("/users/update-device-token", {
        user: response.data.user.email, 
        deviceToken,
      });

      console.log('Device token updated successfully');
    }

    return response.data.user;
  } catch (error) {
    console.log("error in loginUser", error);
    throw error;
  }
};




export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_NAME);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
