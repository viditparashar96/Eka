import axios from "axios";

export const getConversationByPhysicianAndPatient = async (
  clerkId: string,
  patientId: string
) => {
  try {
    const response = await axios.get(`/api/get-conversations`, {
      params: {
        clerkId,
        patientId,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
