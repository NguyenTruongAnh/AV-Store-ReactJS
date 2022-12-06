import './introduce.css'
import './introduceResponsive.css'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Introduce() {
    TabTitle('AV Store - Giới thiệu')

    return (
        <div className="introduce">
            <div className="container">
                <div className="introduce-titles">
                    <span className="introduce-title introduce-title--sm">Giới thiệu</span>
                    <span className="introduce-title introduce-title--lg">Anh Vũ Store</span>
                </div>

                <ul className="introduce-list">
                    <li className="introduce-item">
                        <div className="row">
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                <img className="introduce-item__img" src="/images/introduce/introduce1.jpg" alt="" />
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="introduce-item__content">
                                    <div className="introduce-item__wrapper">
                                        <h3 className="introduce-item__title">
                                            Sản phẩm chất lượng cao
                                        </h3>
                                        <p className="introduce-item__description">
                                            -<strong> Anh Vũ Store</strong> cam kết luôn mang đến cho khách hàng các sản phẩm có chất lượng tốt nhất.
                                            <br />- Hoàn tiền <strong>150%</strong> nếu phát hiện sản phẩm là hàng giả.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li className="introduce-item">
                        <div className="row">
                            <div className="col-12 col-md-6 d-md-none d-flex justify-content-center">
                                <img className="introduce-item__img" src="/images/introduce/introduce2.jpg" alt="" />
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="introduce-item__content">
                                    <div className="introduce-item__wrapper">
                                        <h3 className="introduce-item__title">
                                            Trãi nghiệm mua sắm hiện đại
                                        </h3>
                                        <p className="introduce-item__description">
                                            -<strong> Anh Vũ Store</strong> luôn cố gắng mang đến cho khách hàng trãi nghiệm mua sắm tốt nhất.
                                            <br />- Áp dụng <strong>60</strong> ngày đổi/trả <strong>miễn phí</strong> nếu sản phẩm không vừa ý.
                                            <br />- Giao hàng <strong>tận nơi miễn phí</strong> trên toàn quốc.
                                            <br />- Hỗ trợ <strong>24/7</strong> mọi lúc, mọi nơi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 d-none d-md-flex justify-content-center">
                                <img className="introduce-item__img" src="/images/introduce/introduce2.jpg" alt="" />
                            </div>
                        </div>
                    </li>

                    <li className="introduce-item">
                        <div className="row">
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                <img className="introduce-item__img" src="/images/introduce/introduce3.jpg" alt="" />
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="introduce-item__content">
                                    <div className="introduce-item__wrapper">
                                        <h3 className="introduce-item__title">
                                            Giá cả hợp lý
                                        </h3>
                                        <p className="introduce-item__description">
                                            -<strong> Anh Vũ Store</strong> mang đến giá cả cạnh tranh nhất trên thị trường.
                                            <br />- Cảm kết giá tiền bạn thấy trên website chính là giá tiền cuối cùng bạn phải trả, không có bất kỳ chi phí phát sinh nào khác.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li className="introduce-item">
                        <div className="row">
                            <div className="col-12 d-md-none d-flex justify-content-center">
                                <img className="introduce-item__img" src="/images/introduce/introduce4.jpg" alt="" />
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="introduce-item__content">
                                    <div className="introduce-item__wrapper">
                                        <h3 className="introduce-item__title">
                                            Sản phẩm đa dạng
                                        </h3>
                                        <p className="introduce-item__description">
                                            -<strong> Anh Vũ Store</strong> cung cấp đa dạng sản phẩm đến từ các thương hiệu nổi tiếng trên thế giới.
                                            <br />- Cung cấp dịch vụ đặt hàng theo yêu cầu.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 d-none d-md-flex justify-content-center">
                                <img className="introduce-item__img" src="/images/introduce/introduce4.jpg" alt="" />
                            </div>
                        </div>
                    </li>
                </ul>

                <div className="introduce-logan">
                    <h1>Anh Vũ Store</h1>
                    <span>Chất lượng - Sang trọng - Hoàn hảo</span>
                </div>

                <div className="introduce-founder">
                    <h3>Nhà sáng lập:</h3>
                    <ul className="introduce-founder__list">
                        <li className="introduce-founder__item">
                            <img className="introduce-founder__img" src="/images/founders/founder1.jpg" alt="" />
                            <div className="introduce-founder__info">
                                <h4>Nguyễn Trường Anh</h4>
                                <p>Nhà sáng lập</p>
                            </div>
                        </li>
                        <li className="introduce-founder__item">
                            <img className="introduce-founder__img" src="/images/founders/founder2.jpg" alt="" />
                            <div className="introduce-founder__info">
                                <h4>Nguyễn Võ Hoàng Vũ</h4>
                                <p>Đồng sáng lập</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}