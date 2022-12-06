import "./assets/css/base.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Contact from "./pages/contact/Contact";
import Introduce from "./pages/introduce/Introduce";
import Collections from "./pages/collections/Collections";
import Collection from "./pages/collection/Collection";
import Detail from "./pages/detail/Detail";
import Profile from "./pages/profile/Profile";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ConfirmAccount from "./pages/confirmAccount/ConfirmAccount";
import ResendConfirm from "./pages/resendConfirm/ResendConfirm";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cart from "./pages/cart/Cart";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import { getCategories } from "./redux/apiCalls";
function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        getCategories(dispatch);

        AOS.init({
            delay: 200,
            duration: 600,
        });
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/contact" element={<Contact />} />

                <Route path="/introduce" element={<Introduce />} />

                <Route path="/collections" element={<Collections />} />

                <Route path="/collection/:type" element={<Collection />} />

                <Route path="/products/detail/:id" element={<Detail />} />

                <Route path="/cart/" element={!user ? <Navigate to="/" /> : <Cart />} />

                <Route path="/account/:view" element={!user ? <Navigate to="/" /> : <Profile />} />

                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

                <Route path="/confirm-account/:token" element={user ? <Navigate to="/" /> : <ConfirmAccount />} />

                <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />

                <Route path="/resend-confirm" element={user ? <Navigate to="/" /> : <ResendConfirm />} />

                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <ScrollToTop />
            <Footer />
        </Router>
    );
}

export default App;
