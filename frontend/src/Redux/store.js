import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./slices/githubprojects";

export const store = configureStore({
  reducer: {
    weather: projectSlice,
  },
});
