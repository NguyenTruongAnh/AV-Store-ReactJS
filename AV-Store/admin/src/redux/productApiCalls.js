import {
    getProductFailure,
    getProductStart,
    getProductSuccess,
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
} from "./productRedux";
import { tokenExpires } from "./userRedux";
import axios from "axios";
import app from "../config/firebase";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const storage = getStorage(app);
const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/av-store-364309.appspot.com/o/no-image.jpg?alt=media&token=51e7c50a-846f-44f5-9a74-28daa754d8bc";

const getProducts = async (dispatch, page) => {
    dispatch(getProductStart());
    try {
        let url = "/products";
        if (page) {
            url += `?page=${page}`;
        }
        const res = await axios.get(url);
        dispatch(getProductSuccess(res.data));
    } catch (err) {
        dispatch(getProductFailure());
    }
};

const createProduct = async (dispatch, product, samples) => {
    dispatch(createProductStart());
    try {
        const promises = [];
        samples.forEach((sample) => {
            const storageRef = ref(storage, new Date().getTime() + sample.img.file.name);

            const uploadTask = uploadBytes(storageRef, sample.img.file)
                .then((snapshot) => {
                    return getDownloadURL(snapshot.ref);
                })
                .catch((error) => {
                    console.log(error);
                    return defaultImage;
                });
            promises.push(uploadTask);
        });
        product.images = await Promise.all(promises);

        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.post("/products", product, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;
        if (resData.code === 0) {
            dispatch(createProductSuccess(resData.message));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(createProductFailure(resData.message));
        }
    } catch (err) {}
};

const editProduct = async (dispatch, product, editSamples) => {
    dispatch(editProductStart());
    try {
        const submitSamples = [];
        const promies = [];
        let index = 0;
        editSamples.forEach((sample) => {
            const newSample = {
                _id: sample._id,
                change: {},
            };

            if (sample.changeColor) {
                newSample.change.colorId = sample.colorId._id;
            }

            if (sample.imageFile) {
                const storageRef = ref(storage, new Date().getTime() + sample.imageFile.name);

                const uploadTask = uploadBytes(storageRef, sample.imageFile)
                    .then((snapshot) => {
                        return getDownloadURL(snapshot.ref);
                    })
                    .catch((error) => {
                        console.log(error);
                        return defaultImage;
                    });

                newSample.change.image = index;
                promies.push(uploadTask);
                index += 1;
            }

            if (sample.changeColor || sample.imageFile) {
                submitSamples.push(newSample);
            }
        });

        product.images = await Promise.all(promies);
        product.samples = submitSamples;
        if (editSamples[0].imageFile) {
            product.image = product.images[0];
        }

        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.put(`/products/${product._id}`, product, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;
        if (resData.code === 0) {
            dispatch(editProductSuccess(resData.message));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(editProductFailure(resData.message));
        }
    } catch (err) {}
};

const deleteProduct = async (dispatch, id) => {
    dispatch(deleteProductStart());
    try {
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await axios.delete(`/products/${id}`, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });

        const resData = res.data;
        if (resData.code === 0) {
            dispatch(deleteProductSuccess(resData.message));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(deleteProductFailure(resData.message));
        }
    } catch (err) {}
};

const getMaxPage = async (dispatch) => {
    try {
        const res = await axios.get("/products/page");
        dispatch(getMaxPageSuccess(res.data));
    } catch (err) {}
};

export { getProducts, createProduct, editProduct, deleteProduct, getMaxPage };
