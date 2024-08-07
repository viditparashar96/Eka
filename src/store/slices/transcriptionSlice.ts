// src/features/transcriptionSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TranscriptionState {
  isRecording: boolean;
  isPaused: boolean;
  audioBlob: Blob | null;
  file: File | null;
  open: boolean;
  transcription: string;
  patientName: string;
  dob: string;
  loading: boolean;
  status: string;
  notes: string;
}

const initialState: TranscriptionState = {
  isRecording: false,
  isPaused: false,
  audioBlob: null,
  file: null,
  open: false,
  transcription: "",
  patientName: "",
  dob: "",
  loading: false,
  status: "",
  notes: "",
};

export const generateNote = createAsyncThunk(
  "transcription/generateNote",
  async (
    payload: {
      audioBlob: string;
      patientName: string;
      dob: string;
      clerkId: string;
      skip: boolean;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setNotes(""));
      dispatch(setStatus("Generating Transcription..."));
      dispatch(setLoading(true));

      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const result = await reader?.read();
        if (result?.done) break;

        const decodedChunk = decoder.decode(result?.value);
        const parsedChunk = JSON.parse(decodedChunk);

        if (parsedChunk.user) {
          console.log("User Created");
          // You might want to handle navigation differently in Redux
          // For now, we'll just return the user id
          return { userId: parsedChunk.user.id };
        } else if (parsedChunk.transcription) {
          dispatch(setTranscription(parsedChunk.transcription));
          dispatch(setStatus("Generating Notes..."));
        } else if (parsedChunk.Notes && parsedChunk.patientId) {
          dispatch(setNotes(parsedChunk.Notes));
          dispatch(setStatus("Completed"));
          return { patientId: parsedChunk.patientId, notes: parsedChunk.Notes };
        } else if (parsedChunk.error) {
          console.log(parsedChunk.error);
          throw new Error(parsedChunk.error);
        }
      }
    } catch (error: any) {
      console.error("Error generating note:", error);
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
      dispatch(setOpen(false));
      dispatch(setFile(null));
      dispatch(setAudioBlob(null));
    }
  }
);

const transcriptionSlice = createSlice({
  name: "transcription",
  initialState,
  reducers: {
    setIsRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
    setIsPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    setAudioBlob: (state, action: PayloadAction<Blob | null>) => {
      state.audioBlob = action.payload;
    },
    setFile: (state, action: PayloadAction<File | null>) => {
      state.file = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setTranscription: (state, action: PayloadAction<string>) => {
      state.transcription = action.payload;
    },
    setPatientName: (state, action: PayloadAction<string>) => {
      state.patientName = action.payload;
    },
    setDob: (state, action: PayloadAction<string>) => {
      state.dob = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateNote.pending, (state) => {
        state.loading = true;
        state.status = "Generating Transcription...";
      })
      .addCase(generateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "Completed";
        if (action.payload?.notes) {
          state.notes = action.payload.notes;
        }
      })
      .addCase(generateNote.rejected, (state, action) => {
        state.loading = false;
        state.status = "Error";
        console.error("Error:", action.payload);
      });
  },
});

export const {
  setIsRecording,
  setIsPaused,
  setAudioBlob,
  setFile,
  setOpen,
  setTranscription,
  setPatientName,
  setDob,
  setLoading,
  setStatus,
  setNotes,
} = transcriptionSlice.actions;

export default transcriptionSlice.reducer;
