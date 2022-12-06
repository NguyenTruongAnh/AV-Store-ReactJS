import './accountDetail.css'
import './accountDetailResponsive.css'

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CurrencyFormat from 'react-currency-format'
import axios from "axios"
import Loading from '../../components/loading/Loading'
import { TabTitle } from '../../utils/GeneralFunction'

export default function AccountDetail() {
    TabTitle('AV Admin - Chi tiết tài khoản')

    const location = useLocation()
    const userId = location.pathname.split("/")[3]
    const accessToken = useSelector(state => state.user.currentUser.accessToken)
    const [account, setAccount] = useState({})
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Xử lý mở khóa tài khoản
    const handleUnlock = async () => {
        try {
            const res = await axios.put(`/users/block-unblock/${userId}`, { blocked: false },
                {
                    headers: {
                        Authorization: `Beaer ${accessToken}`,
                    },
                })
            if (res.data.code == 0) {
                setAccount({ ...account, blocked: false })
            }
        } catch (err) { }
    }

    // Xử lý khóa tài khoản
    const handleLock = async () => {
        try {
            const res = await axios.put(`/users/block-unblock/${userId}`, { blocked: true },
                {
                    headers: {
                        Authorization: `Beaer ${accessToken}`,
                    },
                })
            if (res.data.code == 0) {
                setAccount({ ...account, blocked: true })
            }
        } catch (err) { }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`/users/${userId}`)
                if (res.data) {
                    setAccount(res.data)
                } else {
                    setAccount(false)
                }
            } catch (err) { }
        }

        const getOrders = async () => {
            try {
                const res = await axios.get(`/orders/find/${userId}`)
                setOrders(res.data)
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            } catch (err) { }
        }

        setIsLoading(true)
        getUser()
        getOrders()
    }, [userId])


    return (
        <div className="account-detail page">
            <h1 className="account-detail__title page__title">Thông tin tài khoản</h1>
            <Link className="link account-detail__back page__back" to="/accounts">
                Quay lại
            </Link>
            <div className="account-detail__content">
                {isLoading ? (
                    <div className="d-flex justify-content-center">
                        <Loading />
                    </div>
                ) : (
                    account ? (
                        <div className="container-fluid">
                            <div className="row">
                                {/* Left */}
                                <div className="col-12 col-lg-6">
                                    <div className="account-detail__info row">
                                        <div className="account-detail__info-item col-12">
                                            <img src={account.avatar} alt="Hình ảnh" />
                                        </div>
                                        <div className="account-detail__info-item col-12">
                                            <h5>{account.name}</h5>
                                        </div>
                                        <div className="account-detail__info-item col-12">
                                            <span>Mã tài khoản</span>
                                            <p>{account._id}</p>
                                        </div>
                                        <div className="account-detail__info-item col-12 col-md-6">
                                            <span>Ngày tạo</span>
                                            <p>{new Date(account.createdAt).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div className="account-detail__info-item col-12 col-md-6">
                                            <span>Số điện thoại</span>
                                            <p>{account.phone}</p>
                                        </div>
                                        <div className="account-detail__info-item col-12 col-md-6">
                                            <span>Email</span>
                                            <p>{account.email}</p>
                                        </div>
                                        <div className="account-detail__info-item col-12 col-md-6">
                                            <span>Ngày sinh</span>
                                            <p>{new Date(account.birthday).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div className="account-detail__info-item col-12 col-md-6">
                                            <span>Giới tính</span>
                                            <p>{account.gender == 1 ? "Nam" : "Nữ"}</p>
                                        </div>
                                    </div>

                                    <div className="account-detail__control">
                                        {account.blocked ? (
                                            <button
                                                className="btn account-detail__control-unlock"
                                                onClick={() => handleUnlock()}
                                            >
                                                <i className="fa-solid fa-lock-open"></i>
                                                Mở khóa tài khoản
                                            </button>
                                        ) : (
                                            <button
                                                className="btn account-detail__control-lock"
                                                onClick={() => handleLock()}
                                            >
                                                <i className="fa-solid fa-lock"></i>
                                                Khóa tài khoản
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="col-12 col-lg-6">
                                    <div className="account-detail__orders">
                                        <div className="table-responsive">
                                            <table className="table account-detail__table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" >ID</th>
                                                        <th scope="col" >Ngày đặt</th>
                                                        <th scope="col" style={{ minWidth: "120px" }}>Tình trạng</th>
                                                        <th scope="col" style={{ minWidth: "180px" }}>Tổng tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.length > 0 ? (
                                                        orders.map((order, index) => (
                                                            <tr
                                                                key={index}
                                                                className="account-detail__table-item"
                                                            >
                                                                <td className="account-detail__table-item-id align-middle">
                                                                    <Link className="link" to={`/orders/detail/${order._id}`}>
                                                                        {order._id}
                                                                    </Link>
                                                                </td>
                                                                <td className="account-detail__table-item-date align-middle">
                                                                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                                                </td>
                                                                <td className={`account-detail__table-item-status align-middle ${order.status.code}`}>
                                                                    {{
                                                                        "wait-confirm": "Chờ xác nhận",
                                                                        "wait-picking": "Chờ lấy hàng",
                                                                        "picked": "Đã giao cho đơn vị vận chuyển",
                                                                        "shipping": "Đang giao",
                                                                        "complete": "Đã giao",
                                                                        "cancel": "Hủy",
                                                                        "return": "Trả hàng"
                                                                    }[order.status]}
                                                                </td>
                                                                <td className="account-detail__table-item-price align-middle">
                                                                    <CurrencyFormat
                                                                        value={order.amount}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        suffix={' đ'}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr className="account-detail__table-item">
                                                            <td colSpan="4" className="text-center">Không có đơn hàng...</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <h4 className="text-center mt-4" style={{color: "var(--text-color)",}}>Tài khoản không tồn tại</h4>
                    )
                )}
            </div>
        </div >
    )
}
