import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        groupCategories: [],
    },
    reducers: {
        getCategory: (state, action) => {
            state.isFetching = false;
            state.categories = action.payload.categories;
            state.groupCategories = action.payload.groupCategories;
        },
    },
});

export const { getCategory } = categorySlice.actions;

export default categorySlice.reducer;
