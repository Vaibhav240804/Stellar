import axios from "axios";
import { toast } from "react-hot-toast";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

export const fetchUserData = async () => {
  try {
    const response = await API.get("/api/auth/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await API.post("/api/2fa/signin", data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const signup = async (data) => {
  try {
    const response = await API.post("/api/2fa/signup", data);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const checkUser = async () => {
  try {
    const response = await API.get("/api/auth/user");
    return response.data;
  } catch (error) {
    console.error("Error checking user:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await API.get("/api/2fa/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await API.post("/api/2fa/verify", data);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export default API;
