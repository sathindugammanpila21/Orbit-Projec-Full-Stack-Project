import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice to handle global and button loading states.
 * Useful for controlling spinners and preventing duplicate submissions.
 */
const initialState = {
  loading: false,       // For full-page or global loading spinner
  buttonLoading: false, // For button-level loading states
};

const loadersSlice = createSlice({
  name: "loaders",
  initialState,
  reducers: {
    /**
     * Set global loading state (e.g. full-page spinner)
     * @param {typeof initialState} state 
     * @param {{ payload: boolean }} action 
     */
    setLoading(state, action) {
      state.loading = action.payload;
    },

    /**
     * Set button-level loading state
     * @param {typeof initialState} state 
     * @param {{ payload: boolean }} action 
     */
    setButtonLoading(state, action) {
      state.buttonLoading = action.payload;
    },

    /**
     * Reset both loading states to false
     * @param {typeof initialState} state 
     */
    resetLoaders(state) {
      state.loading = false;
      state.buttonLoading = false;
    },
  },
});

export const { setLoading, setButtonLoading, resetLoaders } = loadersSlice.actions;
export default loadersSlice.reducer;
