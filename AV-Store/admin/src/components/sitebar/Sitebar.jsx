import './sitebar.css'
import './sitebarResponsive.css'

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from "../../redux/userRedux";

export default function Sitebar() {
    const [isOpenMobileSitebar, setIsOpenMobileSitebar] = useState(false)
    const mobileSitebarElement = useRef(null)
    const [viewInfo, setViewInfo] = useState('/')
    const dispatch = useDispatch();

    const handleLogout = async (e) => {
        dispatch(logout())
    }

    useEffect(() => {
        // Với đường dẫn: http://localhost:8080/accounts?page=10
        // Thì mong muốn chỉ lấy: accounts để biết view
        setViewInfo(`${window.location.href.split("/")[3].split("?")[0]}`)
    }, [window.location.href.split("/")[3].split("?")[0]])

    useEffect(() => {
        const handleClickOutsiteMobileSitebar = function (event) {
            if (!mobileSitebarElement.current.contains(event.target) && isOpenMobileSitebar) {
                setIsOpenMobileSitebar(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutsiteMobileSitebar)

        return () => {
            document.removeEventListener('mousedown', handleClickOutsiteMobileSitebar)
        }
    })

    return (
        <div 
            ref={mobileSitebarElement}
            className="sitebar"
        >
            <div className="sitebar-menu d-lg-none">
                <div
                    className={`sitebar-menu__btn ${isOpenMobileSitebar && 'active'}`}
                    onClick={() => setIsOpenMobileSitebar(!isOpenMobileSitebar)}
                >
                    <span></span>
                </div>
            </div>
            <div className={`sitebar-content ${isOpenMobileSitebar && 'active'}`}>
                <h5 className="sitebar-title">Bảng điều khiển</h5>
                <ul className="sitebar-list">
                    <li
                        className={viewInfo === '' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== '') {
                                setViewInfo('')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/">
                            <i className="fa-solid fa-table-list"></i>
                            Trang chủ
                        </Link>
                    </li>
                </ul>

                <h5 className="sitebar-title">Quản lý</h5>
                <ul className="sitebar-list">
                    {/* Sản phẩm */}
                    <li
                        className={viewInfo === 'accounts' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== 'accounts') {
                                setViewInfo('accounts')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/accounts">
                            <i className="fa-solid fa-user"></i>
                            Tài khoản
                        </Link>
                    </li>

                    {/* Sản phẩm */}
                    <li
                        className={viewInfo === 'products' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== 'products') {
                                setViewInfo('products')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/products">
                            <i className="fa-solid fa-store"></i>
                            Sản phẩm
                        </Link>
                    </li>

                    {/* Danh mục */}
                    <li
                        className={viewInfo === 'categories' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== 'categories') {
                                setViewInfo('categories')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/categories">
                            <i className="fa-solid fa-list-ul"></i>
                            Danh mục sản phẩm
                        </Link>
                    </li>

                    {/* Kho */}
                    <li
                        className={viewInfo === 'warehouse' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== 'warehouse') {
                                setViewInfo('warehouse')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/warehouse">
                            <i className="fa-solid fa-warehouse"></i>
                            Kho
                        </Link>
                    </li>

                    {/* Màu sắc */}
                    <li
                        className={viewInfo === 'colors' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== 'colors') {
                                setViewInfo('colors')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/colors">
                            <i className="fa-solid fa-palette"></i>
                            Màu sắc
                        </Link>
                    </li>

                    {/* Đơn hàng */}
                    <li
                        className={viewInfo === 'orders' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== 'orders') {
                                setViewInfo('orders')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/orders">
                            <i className="fa-solid fa-file-invoice-dollar"></i>
                            Đơn hàng
                        </Link>
                    </li>
                </ul>

                <h5 className="sitebar-title">Khác</h5>
                <ul className="sitebar-list">
                    {/* Mật khẩu */}
                    <li
                        className={viewInfo === 'password' ? "sitebar-item active" : "sitebar-item"}
                        onClick={() => {
                            if (viewInfo !== 'password') {
                                setViewInfo('password')
                            }
                        }}
                    >
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/password">
                            <i className="fa-solid fa-lock"></i>
                            Đổi mật khẩu
                        </Link>
                    </li>

                    <li className="sitebar-item" onClick={handleLogout}>
                        <Link 
                            onClick={() => setIsOpenMobileSitebar(false)}
                            className="link" 
                            to="/login">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Đăng xuất
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}