import axios from "axios";

export const getPatientsbyPhysician = async (clerkId: string) => {
  try {
    const response = await axios.get(`/api/patients`, {
      params: {
        clerkId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
