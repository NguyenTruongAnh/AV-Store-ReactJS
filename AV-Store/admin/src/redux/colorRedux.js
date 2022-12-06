import { createSlice } from "@reduxjs/toolkit";

const colorSlice = createSlice({
    name: "color",
    initialState: {
        colors: [],
        isFetching: false,
        error: false,
        success: false,
        message: false,
        title: false,
    },
    reducers: {
        // CLEAR
        clear: (state) => {
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },

        //GET ALL
        getColorStart: (state) => {
            state.isFetching = true;
        },
        getColorSuccess: (state, action) => {
            state.isFetching = false;
            state.colors = action.payload;
        },
        getColorFailure: (state) => {
            state.isFetching = false;
        },

        //CREATE
        createColorStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },
        createColorSuccess: (state, action) => {
            state.isFetching = false;
            state.message = action.payload.message;
            state.title = "Thêm màu";
            state.colors.push(action.payload.data);
            state.success = true;
        },
        createColorFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Thêm màu";
            state.error = true;
        },

        //EDIT
        editColorStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },
        editColorSuccess: (state, action) => {
            const colorEdit = action.payload.color;
            const index = state.colors.findIndex((c) => c._id === colorEdit.id);
            state.colors[index].name = colorEdit.name;
            state.colors[index].hex = colorEdit.hex;
            state.isFetching = false;
            state.message = action.payload.message;
            state.title = "Chỉnh sửa màu";
            state.success = true;
        },
        editColorFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Chỉnh sửa màu";
            state.error = true;
        },

        // DELETE
        deleteColorStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
        },
        deleteColorSuccess: (state, action) => {
            state.isFetching = false;
            state.colors = state.colors.filter((c) => c._id !== action.payload);
        },
        deleteColorFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Xóa màu";
            state.error = true;
        },
    },
});

export const {
    getColorStart,
    getColorSuccess,
    getColorFailure,
    createColorStart,
    createColorSuccess,
    createColorFailure,
    editColorStart,
    editColorSuccess,
    editColorFailure,
    deleteColorStart,
    deleteColorSuccess,
    deleteColorFailure,
    clear,
} = colorSlice.actions;
export default colorSlice.reducer;
