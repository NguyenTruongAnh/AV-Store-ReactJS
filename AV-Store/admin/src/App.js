import "./assets/css/base.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./App.css";
import "./AppResponsive.css";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Product from "./pages/product/Product";
import ProductCreate from "./pages/productCreate/ProductCreate";
import ProductDetail from "./pages/productDetail/ProductDetail";
import Category from "./pages/category/Category";
import Color from "./pages/color/Color";
import Order from "./pages/order/Order";
import Header from "./components/header/Header";
import Sitebar from "./components/sitebar/Sitebar";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AOS from "aos";
import OrderDetail from "./pages/orderDetail/OrderDetail";
import Warehouse from "./pages/warehouse/Warehouse";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import Password from "./pages/password/Password";
import Account from "./pages/account/Account";
import AccountDetail from "./pages/accountDetail/AccountDetail";

function App() {
    const user = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        AOS.init({
            delay: 200,
            duration: 600,
        });
    }, []);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

                    <Route
                        path="/"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Home />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/accounts"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Account />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/accounts/detail/:id"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <AccountDetail />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/categories"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Category />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/colors"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Color />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Product />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/products/create"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <ProductCreate />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/products/detail/:id"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <ProductDetail />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/warehouse"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Warehouse />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Order />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/orders/detail/:id"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <OrderDetail />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="/password"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <Password />
                                    </div>
                                </>
                            )
                        }
                    />

                    <Route
                        path="*"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <>
                                    <Header />
                                    <div className="content">
                                        <Sitebar />
                                        <PageNotFound />
                                    </div>
                                </>
                            )
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
