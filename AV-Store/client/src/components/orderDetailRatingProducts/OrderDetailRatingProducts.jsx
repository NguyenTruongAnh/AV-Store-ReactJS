import OrderDetailRatingProduct from '../orderDetailRatingProduct/OrderDetailRatingProduct'
import './orderDetailRatingProducts.css'
import './orderDetailRatingProductsResponsive.css'

export default function OrderDetailRatingProducts({ setIsOpenModel }) {
    return (
        <div className="order-detail-rating-products">
            <div className="order-detail-rating-products__list">
                <OrderDetailRatingProduct />
                <OrderDetailRatingProduct />
            </div>
            <div className="order-detail-rating-products__control">
                <button type="button" className="btn btn-danger" onClick={() => setIsOpenModel(false)}>Xác nhận</button>
            </div>
        </div>
    )
}