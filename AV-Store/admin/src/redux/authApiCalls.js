import { loginFailure, loginStart, loginSuccess } from "./userRedux";

import axios from "axios";

const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/auth/login", user);
        const resData = res.data;
        if (resData.code === 0) {
            dispatch(loginSuccess(resData.data));
        } else {
            dispatch(loginFailure(resData.message));
        }
    } catch (err) {}
};

export { login };
