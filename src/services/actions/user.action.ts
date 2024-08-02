import axios from "axios";

export const registerUser = async (data: {
  email: string;
  password: string;
  specialization: string;
}) => {
  try {
    const response = await axios.post("/api/auth/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post("/api/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (data: {
  name: string;
  email: string;
  clerkId: string;
}) => {
  try {
    const response = await axios.post("/api/auth/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
