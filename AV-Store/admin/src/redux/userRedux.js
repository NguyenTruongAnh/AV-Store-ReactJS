import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching:false,
    error:false
  },
  reducers: {
    loginStart: (state) => {
        state.isFetching=true
        state.error = false
    },
    loginSuccess: (state, action) => {
        state.isFetching= false
        state.currentUser = action.payload
        state.error = false
        if(!action.payload.others.isAdmin) {
            state.currentUser = null
            state.error = 'Bạn không có quyền truy cập!'
        }
    },
    loginFailure: (state, action) => {
        state.isFetching= false
        state.error = action.payload
    },
    logout: (state) => {
        state.currentUser = null
        state.error = false
    },
    tokenExpires: (state) => {
        state.currentUser = null
        state.error = 'Phiên đăng nhập đã hết hạn sử dụng!'
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, tokenExpires } = userSlice.actions;
export default userSlice.reducer;