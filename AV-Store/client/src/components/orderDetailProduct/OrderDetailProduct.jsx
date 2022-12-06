import Order from '../order/Order'
import './orderDetailProduct.css'
import './orderDetailProductResponsive.css'

export default function OrderDetailProduct({ products }) {
    return (
        <div className="order-detail-product">
            <div className="order-detail-product__list">
                {products && products.map((product,index) => (
                    <div className="order-detail-product__item" key={index}>
                        <Order product={product}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
