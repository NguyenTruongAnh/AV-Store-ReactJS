import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        isFetching: false,
        maxPage: 1,
        error: false,
        success: false,
        title: false,
        message: false,
    },
    reducers: {
        // CLEAR
        clear: (state) => {
            state.success = false;
            state.error = false;
            state.title = false;
            state.message = false;
        },

        //GET ALL
        getProductStart: (state) => {
            state.isFetching = true;
        },
        getProductSuccess: (state, action) => {
            state.isFetching = false;
            state.products = action.payload;
        },
        getProductFailure: (state) => {
            state.isFetching = false;
        },

        //CREATE
        createProductStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },
        createProductSuccess: (state, action) => {
            state.isFetching = false;
            state.success = true;
            state.message = action.payload;
            state.title = "Thêm sản phẩm";
        },
        createProductFailure: (state, action) => {
            state.isFetching = false;
            state.error = true;
            state.message = action.payload;
            state.title = "Thêm sản phẩm";
        },

        //EDIT
        editProductStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },
        editProductSuccess: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Chỉnh sửa sản phẩm";
            state.success = true;
        },
        editProductFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Chỉnh sửa sản phẩm";
            state.error = true;
        },

        // DELETE
        deleteProductStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },
        deleteProductSuccess: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Xóa sản phẩm";
            state.success = true;
        },
        deleteProductFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Xóa sản phẩm";
            state.error = true;
        },

        // GET MAX PAGE
        getMaxPageSuccess: (state, action) => {
            state.maxPage = action.payload;
        },
    },
});

export const {
    getProductStart,
    getProductSuccess,
    getProductFailure,
    createProductStart,
    createProductSuccess,
    createProductFailure,
    editProductStart,
    editProductSuccess,
    editProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
    getMaxPageSuccess,
    clear,
} = productSlice.actions;
export default productSlice.reducer;
