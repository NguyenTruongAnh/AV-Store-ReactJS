import {
    getColorFailure,
    getColorStart,
    getColorSuccess,
    createColorStart,
    createColorSuccess,
    createColorFailure,
    editColorStart,
    editColorSuccess,
    editColorFailure,
    deleteColorStart,
    deleteColorSuccess,
    deleteColorFailure,
} from "./colorRedux";
import { tokenExpires } from "./userRedux";
import axios from "axios";

const getColors = async (dispatch) => {
    dispatch(getColorStart());
    try {
        const res = await axios.get("/colors");
        dispatch(getColorSuccess(res.data));
    } catch (err) {
        dispatch(getColorFailure());
    }
};

const createColor = async (dispatch, color) => {
    dispatch(createColorStart());
    try {
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.post("/colors", color, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;
        if (resData.code === 0) {
            dispatch(createColorSuccess(resData));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(createColorFailure(resData.message));
        }
    } catch (err) {}
};

const editColor = async (dispatch, color, id) => {
    dispatch(editColorStart());
    try {
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.put(`/colors/${id}`, color, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;
        if (resData.code === 0) {
            const result = {
                message: resData.message,
                color: { ...resData.data, id },
            };
            dispatch(editColorSuccess(result));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(editColorFailure(resData.message));
        }
    } catch (err) {}
};

const deleteColor = async (dispatch, id) => {
    dispatch(deleteColorStart());
    try {
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.delete(`/colors/${id}`, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;

        if (resData.code === 0) {
            dispatch(deleteColorSuccess(id));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(deleteColorFailure(resData.message));
        }
    } catch (err) {}
};

export { getColors, createColor, editColor, deleteColor };
