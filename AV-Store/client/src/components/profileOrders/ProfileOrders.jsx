import Orders from '../orders/Orders'
import './profileOrders.css'
import './profileOrdersResponsive.css'

import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import Loading from '../loading/Loading'
import axios from "axios"

export default function ProfileOrders({ type }) {
    const navigate = useNavigate()
    const userId = useSelector((state) => state.user.currentUser.others._id)
    const [orders, setOrders] = useState([])
    const [isOpenSelect, setIsOpenSelect] = useState(false)
    const [filterType, setFilterType] = useState(type)
    const [isLoading, setIsLoading] = useState(true)
    const typeList = {
        'all': 'Tất cả',
        'wait-confirm': 'Chờ xác nhận',
        'wait-picking': 'Chờ lấy hàng',
        'shipping': 'Đang giao',
        'complete': 'Đã giao',
        'cancel': 'Đã hủy',
        'return': 'Hoàn trả'
    }

    const handleSelectFilter = (selectedFilter) => {
        if (selectedFilter !== filterType) {
            setFilterType(selectedFilter)
            navigate(`/account/orders?type=${selectedFilter}`)
        }
    }

    const handleSelectFilterMobile = (selectedFilter) => {
        if (selectedFilter !== filterType) {
            setIsOpenSelect(false)
            setFilterType(selectedFilter)
            navigate(`/account/orders?type=${selectedFilter}`)
        }
    }

    useEffect(() => {
        const getOrders = async () => {
            try {
                const res = await axios.get("/orders/find/" + userId)
                setOrders(res.data)
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            } catch (err) { }
        }

        setIsLoading(true)
        getOrders()
    }, [])

    return (
        <div className="profile-orders">
            <h2 className="profile-orders__title">Đơn hàng của bạn</h2>
            {/* Filter Mobile */}
            <div className="profile-orders__filters-mobile d-flex d-md-none">
                <div className={isOpenSelect ? "profile-orders__filters-select active" : "profile-orders__filters-select"}>
                    <div
                        className="profile-orders__filters-selected"
                        onClick={() => setIsOpenSelect(!isOpenSelect)}
                    >
                        {typeList[filterType] || 'Tất cả'}
                        <i className="fa-solid fa-angle-down"></i>
                    </div>
                    <ul className="profile-orders__filters-options">
                        <li onClick={() => handleSelectFilterMobile('all')}>Tất cả</li>
                        <li onClick={() => handleSelectFilterMobile('wait-confirm')}>Chờ xác nhận</li>
                        <li onClick={() => handleSelectFilterMobile('wait-picking')}>Chờ lấy hàng</li>
                        <li onClick={() => handleSelectFilterMobile('shipping')}>Đang giao</li>
                        <li onClick={() => handleSelectFilterMobile('complete')}>Đã giao</li>
                        <li onClick={() => handleSelectFilterMobile('cancel')}>Đã hủy</li>
                        <li onClick={() => handleSelectFilterMobile('return')}>Trả hàng</li>
                    </ul>
                </div>
            </div>
            {/* Filter Tablet and PC */}
            <ul className="profile-orders__filters d-none d-md-flex">
                <li
                    className={filterType === 'all' || !typeList[filterType] ? "profile-orders__filter active" : "profile-orders__filter"}
                    onClick={() => handleSelectFilter("all")}
                >
                    Tất cả
                </li>
                <li
                    className={filterType === 'wait-confirm' ? "profile-orders__filter active" : "profile-orders__filter"}
                    onClick={() => handleSelectFilter("wait-confirm")}
                >
                    Chờ xác nhận
                </li>
                <li
                    className={filterType === 'wait-picking' ? "profile-orders__filter active" : "profile-orders__filter"}
                    onClick={() => handleSelectFilter("wait-picking")}
                >
                    Chờ lấy hàng
                </li>
                <li
                    className={filterType === 'shipping' ? "profile-orders__filter active" : "profile-orders__filter"}
                    onClick={() => handleSelectFilter("shipping")}
                >
                    Đang giao
                </li>
                <li
                    className={filterType === 'complete' ? "profile-orders__filter active" : "profile-orders__filter"}
                    onClick={() => handleSelectFilter("complete")}
                >
                    Đã giao
                </li>
                <li
                    className={type === 'cancel' ? "profile-orders__filter active" : "profile-orders__filter"}
                    onClick={() => handleSelectFilter("cancel")}
                >
                    Đã hủy
                </li>
                <li
                    className={type === 'return' ? "profile-orders__filter active" : "profile-orders__filter"}
                    onClick={() => handleSelectFilter("return")}
                >
                    Trả hàng
                </li>
            </ul>
            {(type === 'all' || !type) && (
                <div className="profile-orders__search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Nhập mã đơn hàng" />
                </div>
            )}

            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Loading />
                </div>
            ) : (
                <div className="profile-orders__content">
                    {orders.map((order, index) => (<Orders order={order} key={index} />))}
                </div>
            )}
        </div>
    )
}
