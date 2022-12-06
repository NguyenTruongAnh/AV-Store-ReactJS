import { formatter } from '../../utils/formatMoney'
import './orderDetailCheckouts.css'
import './orderDetailCheckoutsResponsive.css'

export default function OrderDetailCheckouts({payment, amount}) {
    return (
        <div className="order-detail-checkouts">
            <div className="order-detail-checkouts__item">
                <span>Tổng tiền hàng</span>
                <span>{formatter.format(amount)}đ</span>
            </div>
            <div className="order-detail-checkouts__item">
                <span>Phí vận chuyển</span>
                <span>0đ</span>
            </div>
            <div className="order-detail-checkouts__item order-detail-checkouts__item--total">
                <span>Tổng số tiền</span>
                <span>{formatter.format(amount)}đ</span>
            </div>
            <div className="order-detail-checkouts__item">
                <span>Phương thức thanh toán</span>
                <span>{payment == "COD" ? "Thanh toán trực tiếp" : payment}</span>
            </div>
        </div>
    )
}