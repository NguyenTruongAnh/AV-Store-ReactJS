import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
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
        getCategoryStart: (state) => {
            state.isFetching = true;
        },
        getCategorySuccess: (state, action) => {
            state.isFetching = false;
            state.categories = action.payload;
        },
        getCategoryFailure: (state) => {
            state.isFetching = false;
        },

        //CREATE
        createCategoryStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },
        createCategorySuccess: (state, action) => {
            state.isFetching = false;
            state.message = action.payload.message;
            state.title = "Thêm danh mục";
            state.categories.push(action.payload.data);
            state.success = true;
        },
        createCategoryFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Thêm danh mục";
            state.error = true;
        },

        //EDIT
        editCategoryStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
            state.title = false;
        },
        editCategorySuccess: (state, action) => {
            const categoryEdit = action.payload.category;
            const index = state.categories.findIndex((c) => c._id === categoryEdit.id);
            state.categories[index].name = categoryEdit.name;
            state.categories[index].sizes = categoryEdit.sizes;
            if (categoryEdit.imgSmall) {
                state.categories[index].imgSmall = categoryEdit.imgSmall;
            }
            if (categoryEdit.imgLarge) {
                state.categories[index].imgLarge = categoryEdit.imgLarge;
            }
            state.isFetching = false;
            state.message = action.payload.message;
            state.title = "Chỉnh sửa danh mục";
            state.success = true;
        },
        editCategoryFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Chỉnh sửa danh mục";
            state.error = true;
        },

        // DELETE
        deleteCategoryStart: (state) => {
            state.isFetching = true;
            state.success = false;
            state.error = false;
            state.message = false;
        },
        deleteCategorySuccess: (state, action) => {
            state.isFetching = false;
            state.categories = state.categories.filter((c) => c._id !== action.payload);
        },
        deleteCategoryFailure: (state, action) => {
            state.isFetching = false;
            state.message = action.payload;
            state.title = "Xóa danh mục";
            state.error = true;
        },
    },
});

export const {
    getCategoryStart,
    getCategorySuccess,
    getCategoryFailure,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailure,
    editCategoryStart,
    editCategorySuccess,
    editCategoryFailure,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailure,
    clear,
} = categorySlice.actions;
export default categorySlice.reducer;
