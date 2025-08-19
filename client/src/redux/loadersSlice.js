import { createSlice } from "@reduxjs/toolkit";

// Slice to handle global loading states
const loadersSlice = createSlice({
  name: "loaders",
  initialState: {
    loading: false,       // For full-page or global loading spinner
    buttonLoading: false, // For button-level spinners
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setButtonLoading(state, action) {
      state.buttonLoading = action.payload;
    },
  },
});

// Export actions for dispatching
export const { setLoading, setButtonLoading } = loadersSlice.actions;

// Export reducer to configure in store
export default loadersSlice.reducer;
