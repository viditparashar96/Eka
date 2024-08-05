import { Patient } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface PatientsState {
  patients: Patient[];
}
const initialState: PatientsState = {
  patients: [],
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState: initialState,
  reducers: {
    setPatients: (state, action) => {
      state.patients = action.payload;
    },
  },
});

export const { setPatients } = patientsSlice.actions;
export default patientsSlice.reducer;
