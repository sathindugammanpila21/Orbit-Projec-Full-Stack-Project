import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice to manage user state, user list, and notifications.
 */
const initialState = {
  user: null,          // Currently logged-in user object
  allUsers: [],        // All users (for admin or project members)
  notifications: [],   // Notifications for the current user
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    /**
     * Set the currently logged-in user
     * @param {typeof initialState} state 
     * @param {{ payload: object|null }} action 
     */
    setUser(state, action) {
      state.user = action.payload;
    },

    /**
     * Set the full list of users
     * @param {typeof initialState} state 
     * @param {{ payload: object[] }} action 
     */
    setAllUsers(state, action) {
      state.allUsers = action.payload;
    },

    /**
     * Set notifications for the current user
     * @param {typeof initialState} state 
     * @param {{ payload: object[] }} action 
     */
    setNotifications(state, action) {
      state.notifications = action.payload;
    },

    /**
     * Reset all user-related data (e.g. on logout)
     * @param {typeof initialState} state 
     */
    resetUser(state) {
      state.user = null;
      state.allUsers = [];
      state.notifications = [];
    },
  },
});

export const { setUser, setAllUsers, setNotifications, resetUser } = usersSlice.actions;
export default usersSlice.reducer;
