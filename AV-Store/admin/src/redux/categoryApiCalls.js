import {
    getCategoryFailure,
    getCategoryStart,
    getCategorySuccess,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailure,
    editCategoryStart,
    editCategorySuccess,
    editCategoryFailure,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailure,
} from "./categoryRedux";
import { tokenExpires } from "./userRedux";
import axios from "axios";
import app from "../config/firebase";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const storage = getStorage(app);
const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/av-store-364309.appspot.com/o/no-image.jpg?alt=media&token=51e7c50a-846f-44f5-9a74-28daa754d8bc";

const getCategories = async (dispatch) => {
    dispatch(getCategoryStart());
    try {
        const res = await axios.get("/categories");
        dispatch(getCategorySuccess(res.data));
    } catch (err) {
        dispatch(getCategoryFailure());
    }
};

const createCategory = async (dispatch, category, files) => {
    dispatch(createCategoryStart());
    try {
        const promises = [];
        files.forEach((file) => {
            const storageRef = ref(storage, new Date().getTime() + file.name);

            const uploadTask = uploadBytes(storageRef, file)
                .then((snapshot) => {
                    return getDownloadURL(snapshot.ref);
                })
                .catch((error) => {
                    console.log(error);
                    return defaultImage;
                });
            promises.push(uploadTask);
        });
        const images = await Promise.all(promises);
        category.imgLarge = images[0];
        category.imgSmall = images[1];
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.post("/categories", category, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;
        if (resData.code === 0) {
            dispatch(createCategorySuccess(resData));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(createCategoryFailure(resData.message));
        }
    } catch (err) {}
};

const editCategory = async (dispatch, category, id, files, image) => {
    dispatch(editCategoryStart());
    try {
        const promises = [];
        files.forEach((file) => {
            const storageRef = ref(storage, new Date().getTime() + file.name);

            const uploadTask = uploadBytes(storageRef, file)
                .then((snapshot) => {
                    return getDownloadURL(snapshot.ref);
                })
                .catch((error) => {
                    console.log(error);
                    return defaultImage;
                });
            promises.push(uploadTask);
        });
        const images = await Promise.all(promises);
        category.imgLarge = images[0] ? images[0] : image[0];
        category.imgSmall = images[1] ? images[1] : image[1];
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.put(`/categories/${id}`, category, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });
        const resData = res.data;
        if (resData.code === 0) {
            const result = {
                message: resData.message,
                category: { ...resData.data, id },
            };
            dispatch(editCategorySuccess(result));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(editCategoryFailure(resData.message));
        }
    } catch (err) {}
};

const deleteCategory = async (dispatch, id) => {
    dispatch(deleteCategoryStart());
    try {
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.delete(`/categories/${id}`, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;
        if (resData.code === 0) {
            dispatch(deleteCategorySuccess(id));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(deleteCategoryFailure(resData.message));
        }
    } catch (err) {}
};

export { getCategories, createCategory, editCategory, deleteCategory };
