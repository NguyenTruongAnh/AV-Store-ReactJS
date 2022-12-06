import './homeProducts.css'
import './homeProductsResponsive.css'

import { useSelector } from "react-redux";

export default function HomeProducts() {
    const categories = useSelector((state) => state.category.categories);

    return (
        <div className="home-products">
            {categories.map((category,index) => (
                <div className={`home-product ${index % 2 !== 0 ? "home-product--reverse": ""}`} key={index}>
                    <div className="home-product__img">
                        <img src={category.imgLarge} alt="Image" />
                    </div>
                    <div className="home-product__content">
                        <div className="home-product__wrapper">
                            <h3 className="home-product__title">
                                {category.name}
                            </h3>
                            <p className="home-product__desc">
                                Thiết kế độc đáo, cuốn hút, khẳng định đẳng cấp, sản phẩm chất lượng cao
                            </p>
                            <a href={`/collection/${category.slug}`} className="home-product__link">
                                <i className="fa-solid fa-angles-right"></i>
                                <span>Xem chi tiết</span>
                                <i className="fa-solid fa-angles-left"></i>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
