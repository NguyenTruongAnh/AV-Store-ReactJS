import React from 'react'
import Slider from 'react-slick'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './homeSlider.css'
import './homeSliderResponsive.css'

export default function HomeSlider() {
    var settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    }
    
    return (
        <div className="home-slider">
            <div className="home-slider__titles">
                <span className="home-slider__title home-slider__title--lg">Anh Vũ Store</span>
                <span className="home-slider__title home-slider__title--sm">Chất lượng thay lời nói</span>
            </div>
            <Slider {...settings}>
                <div>
                    <img
                        className="home-slider__img"
                        src="/images/homeSlider/home1.jpg"
                        alt="Img"
                    />
                </div>
                {/* <div>
                    <img
                        className="home-slider__img"
                        src="/images/homeSlider/home1.jpg"
                        alt="Img"
                    />
                </div> */}
            </Slider>
        </div>
    );
}
