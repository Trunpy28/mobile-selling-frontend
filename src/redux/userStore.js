import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  name: "",
  phoneNumber: "",
  address: "",
  avatarUrl: "",
  role: "",
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        email = "",
        name = "",
        phoneNumber = "",
        address = "",
        avatarUrl = "",
        role = "",
        accessToken = "",
      } = action.payload;

      state.email = email;
      state.name = name || "";
      state.phoneNumber = phoneNumber;
      state.address = address;
      state.avatarUrl = avatarUrl;
      state.role = role;
      state.accessToken = accessToken;
    },
    changeAvatar: (state, action) => {
      const { avatarUrl = "" } = action.payload;
      state.avatarUrl = avatarUrl;
    },
    updateUserProfile: (state, action) => {
      const {
        name = "",
        phoneNumber = "",
        address = "",
      } = action.payload;

      state.name = name;
      state.phoneNumber = phoneNumber;
      state.address = address;
    },
    resetUser: (state) => {
      state.email = "";
      state.name = "";
      state.phoneNumber = "";
      state.address = "";
      state.avatarUrl = "";
      state.role = "";
      state.accessToken = "";
    },
  },
});

export const { setUser, resetUser, changeAvatar, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;