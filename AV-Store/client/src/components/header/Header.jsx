import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import './header.css'
import './headerResponsive.css'

export default function Header() {
    // Xử lý đóng mở menu của mobile
    const [isOpenMenu, handleOpenMenu] = useState(false)
    // Xử lý đóng mở list sản phẩm trong phần navbar mobile
    const [isOpenMobileProduct, handleOpenMobileProduct] = useState(false)
    // Xử lý việc mở đóng mục tìm kiếm ở Table và PC
    const [isOpenSearch, handleOpenSearch] = useState(false)
    // Lưu dữ liệu search
    const [searchKey, setSearchKey] = useState('')
    // Lấy dữ liệu từ localStorage
    const user = useSelector(state=>state.user.currentUser)
    const quantity = useSelector(state=>state.cart.quantity)
    const groupCategories = useSelector((state) => state.category.groupCategories)

    const handleSearchChange = (e) => {
        setSearchKey(e.target.value)
    }

    const handleSearchKeyUp = (e) => {
        console.log(e.keyCode)
        if (e.keyCode === 13) {
            e.preventDefault()
            setSearchKey('')
            handleOpenSearch(false)
            handleOpenMenu(false)
        }
    }

    return (
        <div className="header">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Header Mobile */}
                    <div className="col-4 col-lg-0 d-block d-lg-none">
                        <div className={isOpenMenu ? "header-mobile active" : "header-mobile"}>
                            <i
                                className="header-icon fa-solid fa-bars"
                                onClick={() => handleOpenMenu(!isOpenMenu)}
                            >
                            </i>
                            <div className="header-mobile__content">
                                <div className="header-mobile__heading">
                                    <div className="header-logo">
                                        <div className="header-logo__img"></div>
                                    </div>
                                    <i
                                        className="fa-solid fa-xmark"
                                        onClick={() => handleOpenMenu(false)}
                                    ></i>
                                </div>
                                <div className="header-mobile__search">
                                    <div className="header-mobile__search-wrapper">
                                        <input
                                            type="text" className="header-mobile__search-input"
                                            placeholder="Nhập tên sản phẩm"
                                            value={searchKey}
                                            onChange={(e) => handleSearchChange(e)}
                                            onKeyUp={(e) => handleSearchKeyUp(e)}
                                        />
                                        <i className="header-mobile__search-icon fa-solid fa-magnifying-glass"></i>
                                    </div>
                                </div>
                                <ul className="header-mobile__nav">
                                    <li className="header-mobile__nav-item">
                                        <Link
                                            className="link" to="/"
                                            onClick={() => handleOpenMenu(false)}
                                        >
                                            Trang chủ
                                        </Link>
                                    </li>
                                    <li className="header-mobile__nav-item">
                                        <Link
                                            className="link"
                                            to="/collections"
                                            onClick={() => handleOpenMenu(false)}
                                        >
                                            Sản phẩm
                                        </Link>
                                        <i
                                            className={isOpenMobileProduct
                                                ? "header-icon header-mobile__icon--open active fa-regular fa-circle-down"
                                                : "header-icon header-mobile__icon--open fa-regular fa-circle-down"
                                            }
                                            onClick={() => handleOpenMobileProduct(!isOpenMobileProduct)}
                                        ></i>
                                        <ul className={isOpenMobileProduct ? "header-mobile__subnav active" : "header-mobile__subnav"}>
                                            {groupCategories.map((groupCategory, index) => (
                                                <li className="header-mobile__subnav-item" key={index}>
                                                    <Link to="#">{groupCategory.name}</Link>
                                                    <ul>
                                                        {groupCategory.array.map((e, index) => (
                                                        <li key={index}>
                                                            <Link to={`/collection/${e.slug}`}>{e.name}</Link>
                                                        </li>))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li className="header-mobile__nav-item">
                                        <Link
                                            className="link" to="/introduce"
                                            onClick={() => handleOpenMenu(false)}
                                        >
                                            Giới thiệu
                                        </Link>
                                    </li>
                                    <li className="header-mobile__nav-item">
                                        <Link
                                            className="link"
                                            to="/contact"
                                            onClick={() => handleOpenMenu(false)}
                                        >
                                            Liên hệ
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div
                                className="header-mobile__overlay"
                                onClick={() => handleOpenMenu(false)}>
                            </div>
                        </div>
                    </div>

                    {/* Header Left */}
                    <div className="col-4 col-lg-3 px-0">
                        <div className="header-left">
                            <Link className="link" to="/">
                                <div className="header-logo">
                                    <div className="header-logo__img"></div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Header Center */}
                    <div className="col-4 col-lg-6 d-none d-lg-block">
                        <div className="header-center">
                            <div className="header-nav">
                                <div className="header-nav__item">
                                    <Link className="link" to="/">Trang chủ</Link>
                                </div>
                                <div className="header-nav__item header-nav__item--products">
                                    <Link className="link" to="/collections">Sản phẩm</Link>
                                    <div className="header-subnav">
                                        <div className="container">
                                            <div className="row justify-content-center">
                                                {groupCategories.map((groupCategory, index) => (
                                                    <div className="col-12 col-lg-2" key={index}>
                                                        <div className="header-subnav__item">
                                                            <Link className="header-subnav__title" to="#">{groupCategory.name}</Link>
                                                            <ul className="header-subnav__menu">
                                                                {groupCategory.array.map((e, index) => (
                                                                <li key={index}>
                                                                    <Link to={`/collection/${e.slug}`}>{e.name}</Link>
                                                                </li>))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="header-nav__item">
                                    <Link className="link" to="/introduce">Giới thiệu</Link>
                                </div>
                                <div className="header-nav__item">
                                    <Link className="link" to="/contact">Liên hệ</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Header Right */}
                    <div className="col-4 col-lg-3">
                        <div className="header-right">
                            <div className="header-actions">
                                {/* Search Tablet and PC */}
                                <div className="header-actions__item d-none d-lg-block">
                                    <i
                                        className="header-icon fa-solid fa-magnifying-glass"
                                        onClick={() => handleOpenSearch(true)}
                                    >
                                    </i>
                                </div>
                                {/* Login */}
                                {user ? (
                                    <>
                                        {/* Cart */}
                                        <div className="header-actions__item">
                                            <Link className="link" to={`/cart/`}>
                                            <div className="header-icon">
                                                <i className="header-icon fa-solid fa-cart-shopping"></i>
                                                <span>{quantity > 9 ? "9+" : quantity}</span>
                                            </div>
                                            </Link>
                                        </div>
                                        {/* Account for Tablet and PC */}
                                        <div className="header-actions__item">
                                            <Link className="link" to={`/account/profile`}>
                                                <img className="header-img" src={user.others.avatar} alt="Avatar" />
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="header-actions__item">
                                        <Link className="link" to="/login">Đăng nhập</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Search input for Table and PC */}
                    <div className={isOpenSearch ? "header-search active" : "header-search"}>
                        <i
                            className="header-icon fa-solid fa-xmark"
                            onClick={() => handleOpenSearch(false)}
                        ></i>
                        <input
                            type="text"
                            className="header-search__input"
                            placeholder="Tìm kiếm sản phẩm"
                            value={searchKey}
                            onChange={(e) => handleSearchChange(e)}
                            onKeyUp={(e) => handleSearchKeyUp(e)}
                        />
                        <i
                            className="header-icon fa-solid fa-magnifying-glass"
                            onClick={() => handleOpenSearch(false)}
                        ></i>
                    </div>
                </div>
            </div>
        </div>
    )
}
