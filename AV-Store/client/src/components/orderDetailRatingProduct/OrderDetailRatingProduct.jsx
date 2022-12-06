import './orderDetailRatingProduct.css'
import './orderDetailRatingProductResponsive.css'

import ReactStars from 'react-rating-stars-component'
import { useState } from 'react'

export default function OrderDetailRatingProduct() {
    const [ratingValue, setRatingValue] = useState('')
    const [ratingLength, setRatingLength] = useState(0)

    const handleInputValue = function(e) {
        if (e.target.value.length > 50) {
            e.preventDefault()
        } else {
            setRatingValue(e.target.value)
            setRatingLength(e.target.value.length)
        }
    }

    return (
        <div className="order-detail-rating-product">
            <div className="order-detail-rating-product__img">
                <img src={`/images/products/ao1.jpg`} alt="Image" />
            </div>
            <div className="order-detail-rating-product__content">
                <div className="order-detail-rating-product__info">
                    <div className="order-detail-rating-product__heading">
                        <div className="order-detail-rating-product__name">
                            <span>Áo Vest K90</span>
                        </div>
                        <div className="order-detail-rating-product__stars">
                            <ReactStars
                                count={5}
                                value={5}
                                isHalf={true}
                                edit={true}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                fullIcon={<i className="fa fa-star"></i>}
                            />
                        </div>
                    </div>
                    <div className="order-detail-rating-product__parameter">
                        <span>1</span>
                        -
                        <span>XL</span>
                        -
                        <span>Đen</span>
                    </div>
                </div>
                <textarea 
                    rows="3" 
                    className="order-detail-rating-product__input"
                    value={ratingValue}
                    onChange={(e) => handleInputValue(e)}
                    placeholder="Đánh giá của bạn"
                >
                </textarea>
                <div className="order-detail-rating-product__limit">
                    <span>{ratingLength}/50 ký tự</span>
                </div>
            </div>
        </div>
    )
}