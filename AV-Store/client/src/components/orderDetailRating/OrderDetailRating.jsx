import OrderDetailRatingProducts from '../orderDetailRatingProducts/OrderDetailRatingProducts'
import './orderDetailRating.css'
import './orderDetailRatingResponsive.css'

import { useState } from 'react'

export default function OrderDetailRating({ isCompletedRating }) {
    const [isOpenModel, setIsOpenModel] = useState(false)
    
    return (
        <div className="order-detail-rating">
            {isCompletedRating ? (
                <>
                    <span>
                        Cảm ơn bạn đã đánh giá sản phẩm.
                    </span>
                    <button type="button" className="btn btn-outline-danger" disabled>Đã đánh giá</button>
                </>
            ) : (
                <>
                    <span>
                        Bạn chưa đánh giá đơn hàng.
                    </span>
                    <button type="button" className="btn btn-danger" onClick={() => setIsOpenModel(true)}>Đánh giá</button>
                </>
            )}
            <div className={isOpenModel ? "order-detail-rating__model active" : "order-detail-rating__model"}>
                <div className="order-detail-rating__model-content">
                    <div className="order-detail-rating__model-title">
                        <span>Đánh giá sản phẩm</span>
                        <i className="fa-solid fa-xmark" onClick={() => setIsOpenModel(false)}></i>
                    </div>
                    <OrderDetailRatingProducts setIsOpenModel={setIsOpenModel} />
                </div>
                <div className="order-detail-rating__model-overlay" onClick={() => setIsOpenModel(false)}></div>
            </div>
        </div>
    )
}
