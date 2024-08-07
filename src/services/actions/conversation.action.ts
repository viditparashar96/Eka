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

export const updateConversationNotes = async ({
  notes,
  conversationId,
  patientId,
  clerkId,
}: {
  notes: string;
  conversationId: string;
  patientId: string;
  clerkId: string;
}) => {
  try {
    const response = await axios.patch(`/api/edit-notes`, {
      notes,
      conversationId,
      patientId,
      clerkId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
