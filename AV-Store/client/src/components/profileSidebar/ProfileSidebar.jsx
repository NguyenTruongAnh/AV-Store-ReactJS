import './profileSidebar.css'
import './profileSidebarResponsive.css'

import { Link, useNavigate } from 'react-router-dom'
import { logout } from "../../redux/userRedux";
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";

export default function ProfileSidebar({ view, type, orderId }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart)
    const accessToken = useSelector(state => state.user.currentUser.accessToken)
    const handleSelectedView = (selectedView) => {
        /**
         * Giải thích code:
         *      + Với đường dẫn: /account/orders
         *           Load lại trang 'all' khi:
         *              - Loại filter khác '' hoặc 'all'
         *              - Id order khác null
         *              - View hiện tại không phải orders
         *           Giữ nguyên trang không phải load lại khi:
         *              - Id order là null + loại filter khác '' hoặc 'all' + view đang không phải orders
         *      + Với các đường dẫn còn lại:
         *          Nếu view được chọn không bị lặp lại thì sẽ đổi đường dẫn
         *  => Chú ý đặc biết với đường dẫn orders vì có nhiều tính huống cần xử lý hơn
         */
        if (selectedView !== view && selectedView !== 'orders') {
            navigate(`/account/${selectedView}`)
        }
        if (selectedView === 'orders') {
            if (type && !orderId  && view === 'orders') {
                return
            } else {
                navigate(`/account/${selectedView}`)
            }
        }
    }

    const handleLogout = async () => {
        try {
            const res = await axios.put(`/cart/`, { products: cart.products }, {
                headers: {
                    'Authorization': `Beaer ${accessToken}`
                }
            });
        } catch(err) {}
        dispatch(logout())
    }

    return (
        <div className="profile-sidebar">
            <div className="container">
                <div className="row">
                    <div className="col-12 px-0 px-md-3">
                        <div
                            className={view === "profile" ? "profile-sidebar__item active" : "profile-sidebar__item"}
                            onClick={() => handleSelectedView("profile")}
                        >
                            <i className="hide-on-mobile fas fa-user-circle"></i>
                            Thông tin cá nhân
                        </div>
                    </div>

                    <div className="col-12 px-0 px-md-3">
                        <div
                            className={view === "orders" ? "profile-sidebar__item active" : "profile-sidebar__item"}
                            onClick={() => handleSelectedView("orders")}
                        >
                            <i className="hide-on-mobile fa-solid fa-list-check"></i>
                            Danh sách đơn hàng
                        </div>
                    </div>

                    <div className="col-12 px-0 px-md-3">
                        <div
                            className={view === "password" ? "profile-sidebar__item active" : "profile-sidebar__item"}
                            onClick={() => handleSelectedView("password")}
                        >
                            <i className="hide-on-mobile fa-solid fa-lock"></i>
                            Đổi mật khẩu
                        </div>
                    </div>

                    <div className="col-12 px-0 px-md-3">
                        <Link className="link" to="/login" onClick={handleLogout}>
                            <div className="profile-sidebar__item">
                                <i className="hide-on-mobile fas fa-sign-out-alt"></i>
                                Đăng xuất
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
