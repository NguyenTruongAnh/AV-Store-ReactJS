import './orders.css'
import './orders.css'
import './ordersResponsive.css'
import Order from '../order/Order'

import { Link } from 'react-router-dom'
import { formatter } from '../../utils/formatMoney'

export default function Orders({ order }) {
    return (
        <div className="orders">
            <div className="orders-header">
                <div className="orders-header__left">
                    <Link to={`/account/orders?id=${order._id}`}>
                        {order._id}
                    </Link>
                    <span>{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="orders-header__right">
                    <span>{
                        {
                            "wait-confirm": "Chờ xác nhận",
                            "wait-picking": "Chờ lấy hàng",
                            "picked": "Đã giao cho đơn vị vận chuyển",
                            "shipping": "Đang giao",
                            "complete": "Đã giao",
                            "cancel": "Hủy",
                            "return": "Trả hàng"
                        }[order.status]
                    }</span>
                </div>
            </div>
            <div className="orders-body">
                <Link to={`/account/orders?id=${order._id}`}>
                    {order.products.map((product,index) => (<>
                        <Order product={product} key={index}/>
                        <span className="orders-body__divide"></span>
                    </>))}
                </Link>
            </div>
            <div className="orders-footer">
                <span>Tổng tiền: <b>{formatter.format(order.amount)}</b></span>
            </div>
        </div>
    )
}
