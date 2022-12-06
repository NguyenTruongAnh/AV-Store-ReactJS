import {
    loginFailure,
    loginStart,
    loginSuccess,
    updateFailure,
    updateStart,
    updateSuccess,
    tokenExpires,
} from "./userRedux";
import { loginCart } from "./cartRedux";
import { getCategory } from "./categoryRedux";
import app from "../config/firebase";
import axios from "axios";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const storage = getStorage(app);
const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/av-store-364309.appspot.com/o/unknow.jpg?alt=media&token=1bc8e321-b02c-4fd2-acf5-f1aa6e26e0d5";

const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/auth/login", user);
        const resData = res.data;

        if (resData.code === 0) {
            const { cart, ...account } = resData.data;
            dispatch(loginCart(cart));
            dispatch(loginSuccess(account));
        } else {
            dispatch(loginFailure(resData.message));
        }
    } catch (err) {}
};

const update = async (dispatch, info, id, file) => {
    dispatch(updateStart());
    try {
        const accessToken = JSON.parse(JSON.parse(localStorage.getItem("persist:root-client")).user).currentUser
            .accessToken;
        if (file) {
            const storageRef = ref(storage, new Date().getTime() + file.name);
            info.avatar = await uploadBytes(storageRef, file)
                .then((snapshot) => {
                    return getDownloadURL(snapshot.ref);
                })
                .catch((error) => {
                    // console.log(error);
                    return defaultImage;
                });
        }

        const res = await axios.put(`/users/${id}`, info, {
            headers: {
                Authorization: `Beaer ${accessToken}`,
            },
        });
        const resData = res.data;
        if (resData.code === 0) {
            dispatch(updateSuccess({ mess: resData.message, info, address: resData.data }));
        } else if (resData.code === 2) {
            dispatch(tokenExpires());
        } else {
            dispatch(updateFailure(resData.message));
        }
    } catch (err) {}
};

const getCategories = async (dispatch) => {
    try {
        const res = await axios.get("/categories");
        const resData = res.data;
        const groupCategories = [];
        groupCategories.push({
            name: "Áo nam",
            array: resData.filter((category) => category.name.toLowerCase().indexOf("áo") > -1),
        });
        groupCategories.push({
            name: "Quần nam",
            array: resData.filter((category) => category.name.toLowerCase().indexOf("quần") > -1),
        });
        groupCategories.push({
            name: "Bộ Suit",
            array: resData.filter((category) => category.name.toLowerCase().indexOf("suit") > -1),
        });
        groupCategories.push({
            name: "Giày nam",
            array: resData.filter((category) => category.name.toLowerCase().indexOf("giày") > -1),
        });
        groupCategories.push({
            name: "Phụ kiện",
            array: resData.filter(
                (category) =>
                    category.name.toLowerCase().indexOf("áo") === -1 &&
                    category.name.toLowerCase().indexOf("quần") === -1 &&
                    category.name.toLowerCase().indexOf("giày") === -1 &&
                    category.name.toLowerCase().indexOf("suit") === -1
            ),
        });

        dispatch(getCategory({ groupCategories, categories: resData }));
    } catch (err) {}
};

const loginGoogle = async (dispatch) => {
    dispatch(loginStart());
    try {
        const res = await axios.get("/auth/login/google");
        const resData = res.data;

        if (resData.code === 0) {
            const { cart, ...account } = resData.data;
            dispatch(loginCart(cart));
            dispatch(loginSuccess(account));
        } else {
            dispatch(loginFailure(resData.message));
        }
    } catch (err) {}
};

export { login, update, getCategories, loginGoogle };
