import './home.css'
import './homeResponsive.css'

import HomeSlider from '../../components/homeSlider/homeSlider'
import CollectionsFilter from '../../components/collectionsFilter/CollectionsFilter'
import HomeProducts from '../../components/homeProducts/HomeProducts'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Home() {
    TabTitle('AV Store - Trang chủ')

    return (
        <>
            <div className="home">
                <HomeSlider />

                {/* Home Content */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-lg-8 offset-lg-2">
                            <div className="home-list">
                                <div className="home-item">
                                    <div className="home-item__title">
                                        <span>Bộ sưu tập</span>
                                    </div>
                                    <div className="home-item__content">
                                        <CollectionsFilter />
                                        <a
                                            className="home-item__link"
                                            href="/collections"
                                        >
                                            <i className="fa-solid fa-angles-right"></i>
                                            <span>Xem chi tiết</span>
                                            <i className="fa-solid fa-angles-left"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="home-item">
                                    <div className="home-item__title">
                                        <span>Danh mục sản phẩm</span>
                                    </div>
                                    <div className="home-item__content">
                                        <HomeProducts />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-8 offset-lg-2">
                            <div className="home-member">
                                <div className="home-member__wrapper">
                                    <p>Đăng ký ngay để nhận nhiều ưu đãi thành viên!</p>
                                </div>
                                <a className="home-member__link" href="/register">Gia nhập ngay</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
