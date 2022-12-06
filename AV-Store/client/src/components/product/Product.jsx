import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './product.css'
import './productResponsive.css'

import React from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import { formatter } from '../../utils/formatMoney'
export default function Product({ product }) {
    var settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
    }

    return (
        // Bán hết thì thêm class: product--sold-out
        // Đang sale thì thêm class: product--sale
        <div className="product product--sale">
            <div className="product-img">
                <Link to={`/products/detail/${product._id}`}>
                    <Slider {...settings}>
                        <div>
                            <img src={product.image} alt="Image" />
                        </div>
                    </Slider>
                </Link>
            </div>
            <div className="product-info">
                <Link to={`/products/detail/${product._id}`} className="product-name">
                    {product.name}
                </Link>
                <div className="product-wrapper">
                    {product.discount ? (<div className="product-price">
                        <span className="product-price__current">
                            {formatter.format(Math.round((product.price * (1 - product.discount / 100)) / 1000) * 1000)}đ
                        </span>
                        <span className="product-price__old">
                            {formatter.format(product.price)}đ
                        </span>
                    </div>) : <div className="product-price">
                        <span className="product-price__current">
                            {formatter.format(product.price)}đ
                        </span>
                    </div>}
                    
                    <div className="product-action">
                        <div className="product-rating">
                            <i className="fa-solid fa-star"></i>
                            <span>4.5</span>
                        </div>
                        <div className="product-sold">
                            (10) đã bán
                        </div>
                    </div>
                </div>
            </div>
            {product.discount > 0 && (<div className="product-sale">
                <span>{product.discount}%</span>
                <span>Giảm</span>
            </div>)}
        </div>
    )
}