import './orderDetail.css'
import './orderDetailResponsive.css'

import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import OrderDetailStep from '../orderDetailStep/OrderDetailStep'
import OrderDetailInfo from '../orderDetailInfo/OrderDetailInfo'
import OrderDetailProduct from '../orderDetailProduct/OrderDetailProduct'
import OrderDetailCheckouts from '../orderDetailCheckouts/OrderDetailCheckouts'
import OrderDetailRating from '../orderDetailRating/OrderDetailRating'
import Loading from '../loading/Loading'
import axios from "axios"

export default function OrderDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    let params = new URLSearchParams(location.search)
    // const orderStatus = ['wait-confirm', 'paid-online', 'picked', 'complete', 'rating', 'return']
    const orderStatus = ['wait-confirm', 'paid-online', 'picked', 'complete', 'rating']
    const [isOpenSteps, handleOpenSteps] = useState(false)
    const [order, setOrder] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getOrder = async () => {
            try {
                const res = await axios.get("/orders/" + params.get("id"))
                console.log(res)
                setTimeout(() => {
                    setIsLoading(false)
                }, 100)

                if (res.data) {
                    setOrder(res.data)
                } else {
                    setOrder(null)
                    // navigate('/account/orders')
                }
            } catch (err) { }
        }

        setIsLoading(true)
        getOrder()
    }, [params.get("id")])

    return (
        <div className="order-detail">
            <h2 className="order-detail__title">Chi tiết đơn hàng</h2>
            {isLoading ? (
                <div className="d-flex justify-content-center mt-5">
                    <Loading />
                </div>
            ) : (
                order ? (
                    <>
                        <div className="order-detail__heading">
                            <div className="order-detail__heading-left">
                                <span onClick={() => navigate(-1)}>
                                    <i className="fa-solid fa-chevron-left"></i>
                                    Trở lại
                                </span>
                            </div>
                            <div className="order-detail__heading-right">
                                <span>Mã đơn hàng: <b>{order._id}</b></span>
                                <span></span>
                                <span>{
                                    {
                                        "wait-confirm": "Chờ xác nhận",
                                        "wait-picking": "Chờ lấy hàng",
                                        "picked": "Đã giao cho đơn vị vận chuyển",
                                        "shipping": "Đang giao",
                                        "complete": "Đã giao",
                                        "cancel": "Hủy",
                                        // "return": "Trả hàng"
                                    }[order.status]
                                }</span>
                            </div>
                        </div>
                        <OrderDetailStep
                            orderStatus={orderStatus}
                            currentStep={order.status}
                            isOpenSteps={isOpenSteps}
                            handleOpenSteps={handleOpenSteps}
                        />
                        {order.status === "rating" && <OrderDetailRating isCompletedRating={false} />}
                        <OrderDetailInfo payment={order.payment} address={order.address} />
                        <OrderDetailProduct products={order.products} />
                        <OrderDetailCheckouts payment={order.payment} amount={order.amount} />
                    </>
                ) : (
                    <h4 className="d-flex justify-content-center align-items-center h-100">Đơn hàng không tồn tại</h4>
                )
            )}
        </div>
    )
}