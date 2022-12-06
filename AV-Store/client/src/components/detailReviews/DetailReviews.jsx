import './detailReviews.css'
import './detailReviewsResponsive.css'

import DetailReview from '../detailReview/DetailReview'

export default function DetailReviews() {
    return (
        <div className="detail-reviews">
            <div className="detail-reviews__heading">
                <span className="detail-reviews__nums">
                    <b>(80)</b>
                    <span>Đánh giá</span>
                </span>
                <span className="detail-reviews__stars">
                    <span>4.5 / 5</span>
                    <i className="fa fa-star"></i>
                </span>
            </div>
            <div className="detail-reviews__filters">
                <select className="detail-reviews__filter" name="" id="">
                    <option value="">Đánh giá</option>
                    <option value="1">1 sao</option>
                    <option value="2">2 sao</option>
                    <option value="3">3 sao</option>
                    <option value="4">4 sao</option>
                    <option value="5">5 sao</option>
                </select>
                <select className="detail-reviews__filter" name="" id="">
                    <option value="">Thời gian</option>
                    <option value="new">Mới nhất</option>
                    <option value="old">Cũ nhất</option>
                </select>
            </div>
            <div className="detail-reviews__list">
                <div className="container-fruid">
                    <div className="row">
                        <div className="col-12 col-md-6 px-0">
                            <DetailReview />
                        </div>
                        <div className="col-12 col-md-6 px-0">
                            <DetailReview />
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
                <button type="button" class="btn btn-outline-secondary">Xem thêm</button>
            </div>
        </div>
    )
}