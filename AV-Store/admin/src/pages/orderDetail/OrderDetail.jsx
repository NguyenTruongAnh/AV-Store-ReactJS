import './orderDetail.css'
import './orderDetailResponsive.css'

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import OrderProduct from '../../components/orderProduct/OrderProduct'
import CurrencyFormat from 'react-currency-format'
import axios from "axios"
import CustomModal from '../../components/customModal/CustomModal'
import Loading from '../../components/loading/Loading'
import { useSelector } from "react-redux"
import { TabTitle } from '../../utils/GeneralFunction'

export default function OrderDetail() {
    TabTitle('AV Admin - Chi tiết đơn hàng')

    const tokenGHN = "a607cce7-4e23-11ed-b26c-02ed291d830a"
    const location = useLocation()
    const navigate = useNavigate()
    const orderId = location.pathname.split("/")[3]
    const accessToken = useSelector(state=>state.user.currentUser.accessToken)
    const [isOpenModalParameter, setIsOpenModalParameter] = useState(false)
    const [isOpenModalCancel, setIsOpenModalCancel] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [order, setOrder] = useState({})
    const [length, setLength] = useState(0)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(false)
    const [reason, setReason] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const handleCreateShipOrder = async () => {
        if(length > 150 || width > 150 || height > 150) {
            setError("Chiều dài, rộng, cao của hộp đựng không được quá 150 cm")
        } else if(length > 0 && width > 0 && height > 0) {
            const data = {
                length: parseInt(length), 
                width: parseInt(width), 
                height: parseInt(height)
            }
            try {
                const res = await axios.post("/orders/ship/" + orderId, data, 
                {
                    headers: {
                        Authorization: `Beaer ${accessToken}`,
                    },
                })
                const resData = res.data
                setIsOpenModalParameter(false)
                if(resData.code == 0) {
                    setOrder({ ...order, order_code: resData.data, status: "wait-picking"})
                    setMessage(resData.message)
                } else {
                    setMessage(resData.message)
                }
                setIsOpenModal(true)
            } catch(error) {}
        } else {
            setError("Vui lòng nhập đầy đủ thông tin")
        }
    }

    const handleUpdateOrder = async () => {
        try {
            const res = await axios.put("/orders/" + orderId, { status: "picked"}, {
                headers: {
                    Authorization: `Beaer ${accessToken}`,
                },
            })
            const resData = res.data
            if(resData.code == 0) {
                setOrder({ ...order, status: "picked"})
                setMessage(resData.message)
            } else {
                setMessage(resData.message)
            }

            setIsOpenModal(true)
        } catch(error) {}
    }

    const handlePrintOrder = async () => {
        try {
            const res = await axios.post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token",
                { order_codes: [order.order_code]},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Token": tokenGHN
                    }
                })
            
           const url = "https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token=" + res.data.data.token
           window.open(url, '_blank', 'noopener,noreferrer')
        } catch(error) {}
    }

    const handleCancelOrder = async () => {
        if(reason) {
            setIsOpenModalCancel(false)
            try {
                const data = {
                    status: "cancel",
                    reason
                }
                const res = await axios.put(`/orders/cancel/${orderId}`, data, {
                    headers: {
                        Authorization: `Beaer ${accessToken}`,
                    },
                })

                const resData = res.data
                if(resData.code == 0) {
                    setOrder({...order, status: "cancel"})
                }

                setMessage(resData.message)
                setIsOpenModal(true)
            } catch(error) {}
        } else {
            setError("Vui lòng nhập lý do hủy đơn hàng.")
        }
    }

    useEffect(() => {
        const getOrder = async () => {
            try {
                const res = await axios.get( `/orders/${orderId}`)

                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)

                if(res.data) {
                    setOrder(res.data)
                } else {
                    setOrder(false)
                }
            } catch (err) {}
        }

        setIsLoading(true)
        getOrder()
    }, [orderId])

    return (
        <div className="order-detail page">
            <h1 className="order-detail__title page__title">Chi tiết đơn hàng: {order._id}</h1>
            <Link className="link order-detail__back page__back" to="/orders">
                Quay lại
            </Link>
            <div className="order-detail__content">
                <div className="container-fluid">
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Loading />
                        </div>
                    ) : (
                        order._id ? (
                            <div className="row">
                                <div className="col-12 col-xl-7">
                                    <h4 className="order-detail__sub-title">Danh sách sản phẩm</h4>
                                    <div className="order-detail__products">
                                        {order.products && order.products.map((product, index) => (
                                            <OrderProduct
                                                key={index}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                    <div className="order-detail__summary">
                                        Tổng tiền:
                                        <CurrencyFormat
                                            className="ml-2"
                                            value={order.amount}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' đ'}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-xl-5">
                                    <h4 className="order-detail__sub-title">Thông tin khách hàng</h4>
                                    <ul className="order-detail__infos">
                                        <li className="order-detail__info">
                                            <label>Họ và tên:</label>
                                            <p>{order.userId ? order.userId.name : ""}</p>
                                        </li>
                                        <li className="order-detail__info">
                                            <label>Số điện thoại:</label>
                                            <p>{order.userId ? order.userId.phone : ""}</p>
                                        </li>
                                        <li className="order-detail__info">
                                            <label>Email:</label>
                                            <p>{order.userId ? order.userId.email : ""}</p>
                                        </li>
                                        <li className="order-detail__info">
                                            <label>Địa chỉ:</label>
                                            <p>{order.address ? `${order.address.address}, ${order.address.ward.name}, ${order.address.district.name}, ${order.address.province.name}` : ""}</p>
                                        </li>
                                        <li className="order-detail__info">
                                            <label>Ghi chú:</label>
                                            <p>{order.note ? order.note : "Không"}</p>
                                        </li>
                                        <li className="order-detail__info">
                                            <label>Ngày đặt:</label>
                                            <p>{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                                        </li>
                                        <li className="order-detail__info">
                                            <label>Hình thức thanh toán:</label>
                                            <p>{order.payment == "COD" ? "Thanh toán trực tiếp" : order.payment}</p>
                                        </li>
                                    </ul>
                                    <div className={`order-detail__status ${order.status}`}>
                                        Tình trạng:
                                        <span className="ml-1">
                                            {{
                                                "wait-confirm": "Chờ xác nhận",
                                                "wait-picking": "Chờ lấy hàng",
                                                "picked": "Đã giao cho đơn vị vận chuyển",
                                                "shipping": "Đang giao",
                                                "complete": "Đã giao",
                                                "cancel": "Hủy",
                                                "return": "Trả hàng"
                                            }[order.status]}
                                        </span>
                                    </div>
                                    
                                    {
                                        {'wait-confirm' : (
                                            <div className="order-detail__control">
                                                <button
                                                    className="order-detail__control--confirm"
                                                    onClick={() => setIsOpenModalParameter(true)}
                                                >
                                                    <i className="fa-solid fa-circle-check"></i>
                                                    Xác nhận
                                                </button>
                                                <button
                                                    className="order-detail__control--cancel"
                                                    onClick={() => setIsOpenModalCancel(true)}
                                                >
                                                    <i className="fa-solid fa-ban"></i>
                                                    Hủy
                                                </button>
                                            </div>
                                        ),
                                        'wait-picking' : (<div className="order-detail__control">
                                            <button
                                                className="order-detail__control--confirm"
                                                onClick={handleUpdateOrder}
                                            >
                                                <i className="fa-solid fa-circle-check"></i>
                                                Giao hàng
                                            </button>
                                            <button
                                                className="order-detail__control--export"
                                                onClick={handlePrintOrder}
                                            >
                                                <i className="fa-solid fa-file-arrow-down"></i>
                                                Xuất vận đơn
                                            </button>
                                        </div>)}
                                        [order.status]
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-12 order-detail__not-found">
                                    <h4>Đơn hàng không tồn tại</h4>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {isOpenModalParameter && (
                <div className="oder-detail__modal">
                    <div className="oder-detail__modal-content">
                        <div className="oder-detail__modal-heading">
                            <p>Thông tin hộp đựng</p>
                            <i
                                className="fa-solid fa-xmark"
                                onClick={() => setIsOpenModalParameter(false)}
                            ></i>
                        </div>

                        <div className="oder-detail__modal-body">
                            <div className="oder-detail__modal-group">
                                <span>Chiều ngang (cm):</span>
                                <CurrencyFormat value={width} thousandSeparator={true} placeholder="Nhập chiều ngang" onValueChange={(values) => {
                                    const { value } = values
                                    setWidth(value)
                                }} />
                            </div>
                            <div className="oder-detail__modal-group">
                                <span>Chiều dài (cm):</span>
                                <CurrencyFormat value={length} thousandSeparator={true} placeholder="Nhập chiều dài" onValueChange={(values) => {
                                    const { value } = values
                                    setLength(value)
                                }} />
                            </div>
                            <div className="oder-detail__modal-group">
                                <span>Chiều cao (cm):</span>
                                <CurrencyFormat value={height} thousandSeparator={true} placeholder="Nhập chiều cao" onValueChange={(values) => {
                                    const { value } = values
                                    setHeight(value)
                                }} />
                            </div>
                        </div>

                        {error && <div className="text-danger mt-1 ml-2">{error}</div>}

                        <div className="order-detail__control mt-4">
                            <button className="order-detail__control--confirm"
                                onClick={handleCreateShipOrder}>
                                <i className="fa-solid fa-circle-check"></i>
                                Xác nhận
                            </button>
                        </div>
                    </div>

                    <div className="oder-detail__modal-overlay"></div>
                </div>
            )}

            {isOpenModalCancel && (
                <div className="oder-detail__modal">
                    <div className="oder-detail__modal-content">
                        <div className="oder-detail__modal-heading">
                            <p>Lý do hủy đơn</p>
                            <i
                                className="fa-solid fa-xmark"
                                onClick={() => setIsOpenModalCancel(false)}
                            ></i>
                        </div>

                        <div className="oder-detail__modal-body">
                            <div className="oder-detail__modal-group">
                                <textarea rows="4" placeholder="Nhập lý do hủy đơn"
                                    onChange={(e) => setReason(e.target.value)}>{reason}</textarea>
                            </div>
                        </div>
                        {error && <div className="text-danger mt-1 ml-2">{error}</div>}
                        <div className="order-detail__control mt-3">
                            <button className="order-detail__control--confirm"
                                onClick={handleCancelOrder}>
                                <i className="fa-solid fa-circle-check"></i>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                    <div className="oder-detail__modal-overlay"></div>
                </div>
            )}

            {/* Modal */}
            <CustomModal
                title={"Thông báo"}
                message={message}
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
            />
        </div>
    )
}
