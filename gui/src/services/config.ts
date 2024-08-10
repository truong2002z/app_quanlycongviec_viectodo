import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

//export const BASE_URL = "http://localhost:4000/"
//export const BASE_URL = "http://10.0.2.2:4000/"
export const BASE_URL = "https://server-0tk5.onrender.com/"


const TIME_OUT = 30000
export const TOKEN_NAME = "user_token"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
})

export const saveToken = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    console.log("error in saveToken", error)
    throw error
  }
}

axiosInstance.interceptors.request.use(async (req) => {
  try {
    const access_token = await AsyncStorage.getItem(TOKEN_NAME)
    req.headers.Authorization = access_token
    return req
  } catch (error) {
    return req
  }
})

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data)

export default axiosInstance