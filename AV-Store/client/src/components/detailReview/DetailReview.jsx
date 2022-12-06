import './detailReview.css'
import './detailReviewResponsive.css'

import React from 'react';
import ReactStars from 'react-rating-stars-component';

export default function DetailReview() {
    return (
        <div className="detail-review">
            <div className="detail-review__heading">
                <div className="detail-review__author">
                    <p>Nguyễn Trường Anh</p>
                    <span>Đen/2XL</span>
                </div>
                <div className="detail-review__stars">
                    <ReactStars
                        count={5}
                        value={4.5}
                        isHalf={true}
                        edit={false}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                    />
                </div>
            </div>
            <p className="detail-review__description">
                Sản phẩm đẹp, đúng mô tả.
            </p>
            <span className="detail-review__date">
                24.09.2022
            </span>
        </div>
    )
}