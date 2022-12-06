import './orderDetailInfo.css'
import './orderDetailInfoResponsive.css'
import { useSelector } from "react-redux";
export default function OrderDetailInfo({ payment, address }) {
    const user = useSelector((state) => state.user.currentUser.others);

    return (
        <div className="order-detail-info">
            <h5>Thông tin đơn hàng:</h5>
            <div>
                <div className="order-detail-info__customer">
                    <h6>{user.name}</h6>
                    <div>
                        <p>
                            <span>SĐT: </span>
                            <b>{user.phone}</b>
                        </p>
                        <p>
                            <span>Hình thức thanh toán: </span>
                            <b>{payment == "COD" ? "Thanh toán trực tiếp" : payment}</b>
                        </p>
                        <p>
                            <span>Địa chỉ: </span>
                            <b>{address && `${address.address} ${address.ward.name} ${address.district.name} ${address.province.name}`}</b>
                        </p>
                    </div>
                </div>
                <div className="order-detail-info__status">
                    <ul className="order-detail-info__status-list">
                        <li className="order-detail-info__status-item active">
                            <span></span>
                            <p>
                                <span>9:30 20-09-2022 </span>
                                <span>Đã giao thành công</span>
                            </p>
                        </li>
                        <li className="order-detail-info__status-item">
                            <span></span>
                            <p>
                                <span>9:30 20-09-2022 </span>
                                <span>Xuất kho 1</span>
                            </p>
                        </li>
                        <li className="order-detail-info__status-item">
                            <span></span>
                            <p>
                                <span>9:30 20-09-2022 </span>
                                <span>Nhập kho 1</span>
                            </p>
                        </li>
                        <li className="order-detail-info__status-item">
                            <span></span>
                            <p>
                                <span>9:30 20-09-2022 </span>
                                <span>Chờ xác nhận</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}