import { createSlice } from "@reduxjs/toolkit";

export const projectSlice = createSlice({
  name: "github",
  initialState: {
    data: null,
  },
  reducers: {
    storeProject: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { storeProject } = projectSlice.actions;
export default projectSlice.reducer;
