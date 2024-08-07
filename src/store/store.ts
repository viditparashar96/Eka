import { configureStore } from "@reduxjs/toolkit";
import patientsSlice from "./patientsSlice";
import transcriptionReducer from "./slices/transcriptionSlice";
export const store = configureStore({
  reducer: {
    patients: patientsSlice,
    transcription: transcriptionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
