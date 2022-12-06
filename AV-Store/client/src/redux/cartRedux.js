import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        products: [],
        quantity: 0,
        total: 0,
    },
    reducers: {
        loginCart: (state, action) => {
            state.products = action.payload.products;
            state.quantity = action.payload.products.length;
            state.total = action.payload.products.reduce(
                (sum, currentValue) => sum + currentValue.quantity * currentValue.price,
                0
            );
        },

        addProduct: (state, action) => {
            const product = action.payload;
            const index = state.products.findIndex((p) => p.sampleId === product.sampleId && p.size === product.size);
            if (index !== -1) {
                state.products[index].quantity += product.quantity;
            } else {
                state.quantity += 1;
                state.products.push(product);
            }
            state.total += product.price * product.quantity;
        },

        updateQuantity: (state, action) => {
            const product = action.payload;
            const index = state.products.findIndex((p) => p.sampleId === product.sampleId && p.size === product.size);
            if (product.type === "desc") {
                state.products[index].quantity -= 1;
                state.total -= state.products[index].price;
            } else {
                state.products[index].quantity += 1;
                state.total += state.products[index].price;
            }
        },
        deleteProduct: (state, action) => {
            const product = action.payload;
            const index = state.products.findIndex((p) => p.sampleId === product.sampleId && p.size === product.size);
            if (index !== -1) {
                state.total -= state.products[index].price * product.quantity;
                state.products.splice(index, 1);
                state.quantity -= 1;
            }
        },
        clear: (state) => {
            state.products = [];
            state.quantity = 0;
            state.total = 0;
        },
    },
});

export const { addProduct, loginCart, updateQuantity, deleteProduct, clear } = cartSlice.actions;
export default cartSlice.reducer;
