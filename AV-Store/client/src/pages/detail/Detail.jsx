import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import './detail.css'
import './detailResponsive.css'

import React from 'react'
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from "swiper"
import axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'
import DetailReviews from '../../components/detailReviews/DetailReviews'
import Loading from '../../components/loading/Loading'
import { formatter } from '../../utils/formatMoney'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { addProduct } from '../../redux/cartRedux'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Detail() {
    TabTitle('AV Store - Thông tin sản phẩm')

    const navigate = useNavigate()
    const location = useLocation()
    const productId = location.pathname.split("/")[3]
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState({})
    const [samples, setSamples] = useState([])
    const [sample, setSample] = useState({})
    const [colorSelected, setColorSelected] = useState("")
    const [sizeSelected, setSizeSelected] = useState("")
    const [editSizes, setEditSizes] = useState([])
    const [swiper, setSwiper] = useState(null)
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.currentUser)
    const [showModal, setShowModal] = useState(false)
    const [showModalSuccess, setShowModalSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const handleQuantity = (type) => {
        if (type === 'desc') {
            quantity > 1 && setQuantity(quantity - 1)
        }
        else
            setQuantity(quantity + 1)
    }

    const handleAddToCart = () => {
        if (user) {
            const p = {
                sampleId: sample._id,
                quantity,
                size: sizeSelected,
                price: Math.round((product.price * (1 - product.discount / 100)) / 1000) * 1000,
            }
            dispatch(addProduct(p))
            setShowModalSuccess(true)
        } else {
            setShowModal(true)
        }
    }

    const handleChangeSample = (sample, index) => {
        swiper.slideTo(index + 1)
        setColorSelected(sample.colorId.name)
        setSizeSelected(Object.keys(sample.quantity[0])[0])
        setEditSizes(sample.quantity)
        setSample(sample)
    }

    const handleChangeSize = (index, key) => {
        if (editSizes[index][key] > 0) {
            setSizeSelected(key)
        }
    }

    useEffect(() => {
        console.log('Lay du lieu')
        const getProduct = async () => {
            try {
                const res = await axios.get(`/products/${productId}`)
                const result = res.data
                if (result.code !== 4) {
                    setProduct(result)
                    setSizeSelected(result.sizes[0])
                } else {
                    setProduct(null)
                }
            } catch (err) { }
        }

        const getSamples = async () => {
            try {
                const res = await axios.get(`/warehouse/productId/${productId}`)
                const result = res.data

                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)

                if (result.code !== 4) {
                    setSamples(result)
                    setColorSelected(result[0].colorId.name)
                    setEditSizes(result[0].quantity)
                    setSample(result[0])
                }
            } catch (err) { }
        }

        setIsLoading(true)
        getProduct()
        getSamples()
    }, [productId])

    return (
        // Bình thường thì ko thêm gì cả: chỉ dùng className là sale
        // Bán hết thì thêm: detail--sold-out
        // Giảm giá thì thêm: detail--sale
        // Ngừng kinh doanh: detail--stop-business (ứng với việc xóa đi sản phẩm)
        <div className="detail detail--sold">
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <Loading />
                </div>
            ) : (
                product ? (
                    <div className="container-fluid detail-content">
                        <div className="row">
                            <div className="col-12 offset-md-0 col-md-6 col-lg-5 offset-lg-1 col-xl-4 offset-xl-1">
                                <div className="detail-swiper">
                                    <Swiper
                                        onSwiper={setSwiper}
                                        style={{
                                            "--swiper-navigation-color": "#fff",
                                            "--swiper-pagination-color": "#fff",
                                        }}
                                        loop={true}
                                        spaceBetween={10}
                                        navigation={true}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="swiper-large"
                                    >
                                        {samples.map((sample, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={sample.image} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    {samples.length > 1 && (
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            loop={true}
                                            spaceBetween={10}
                                            slidesPerView={samples.length > 3 ? 3 : samples.length}
                                            freeMode={true}
                                            watchSlidesProgress={true}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="swiper-small"
                                        >
                                            {samples.map((sample, index) => (
                                                <SwiperSlide key={index}>
                                                    <img src={sample.image} />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                </div>
                            </div>
                            {/* <div className="col-12 offset-md-0 col-md-6 col-lg-4 offset-lg-1">
                            <div className="detail-img">
                                <img src="/images/products/ao1.jpg" alt="Image" />
                                <div className="detail-sold-out">
                                    <p>Hết hàng</p>
                                </div>
                                <div className="detail-stop-business">
                                    <p>Ngưng bán</p>
                                </div>
                            </div>
                        </div> */}
                            <div className="col-12 col-md-6 col-lg-6">
                                <div className="detail-info">
                                    <h1 className="detail-title">
                                        {product.name}
                                    </h1>
                                    <div className="detail-action">
                                        <div className="detail-stars">
                                            <ReactStars
                                                count={5}
                                                value={4.5}
                                                isHalf={true}
                                                edit={false}
                                                emptyIcon={<i className="far fa-star"></i>}
                                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                fullIcon={<i className="fa fa-star"></i>}
                                            />
                                            <span>(46)</span>
                                        </div>
                                        <div className="detail-sold">
                                            Đã bán: <span>100</span>
                                        </div>
                                    </div>
                                    {product.discount > 0 ? (
                                        <div className="detail-price">
                                            <div className="detail-price__old">
                                                {`${formatter.format(product.price)}đ`}
                                            </div>
                                            <div className="detail-price__percent">
                                                {`-${product.discount}đ`}
                                            </div>
                                            <div className="detail-price__current">
                                                {`${formatter.format(Math.round((product.price * (1 - product.discount / 100)) / 1000) * 1000)}đ`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="detail-price">
                                            <div className="detail-price__current">
                                                {`${formatter.format(product.price)}đ`}
                                            </div>
                                        </div>
                                    )}

                                    <ul className="detail-filters">
                                        {/* Color */}
                                        <li className="detail-filter">
                                            <div className="detail-filter__title">
                                                <span>Màu sắc: </span>
                                                <b>{colorSelected}</b>
                                            </div>
                                            <ul className="detail-filter__list detail-filter__list--color">
                                                {samples.map((sample, index) =>
                                                (<li
                                                    key={index}
                                                    style={{ backgroundColor: sample.colorId.hex }}
                                                    title={sample.colorId.name}
                                                    className={colorSelected === sample.colorId.name ? "detail-filter__item active" : "detail-filter__item"}
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    onClick={() => handleChangeSample(sample, index)}
                                                ></li>))}
                                            </ul>
                                        </li>

                                        {/* Size */}
                                        <li className="detail-filter">
                                            <div className="detail-filter__title">
                                                <span>Kích thước: </span>
                                                <b>{sizeSelected}</b>
                                            </div>
                                            <ul className="detail-filter__list detail-filter__list--size">
                                                {editSizes.map((size, index) => {
                                                    const key = Object.keys(size)[0]
                                                    return (
                                                        <li key={index}
                                                            className={`detail-filter__item ${sizeSelected === key ? "active" : size[key] === 0 ? "sold-out" : ""}`}
                                                            onClick={() => handleChangeSize(index, key)}
                                                        >
                                                            {key}
                                                        </li>)
                                                })}
                                            </ul>
                                        </li>
                                    </ul>
                                    <div className="detail-control">
                                        <div className="detail-control__container">
                                            <button className="detail-control__decrease btn" onClick={() => handleQuantity("desc")}>
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span className="detail-control__amount">{quantity}</span>
                                            <button className="detail-control__increase btn" onClick={() => handleQuantity("asc")}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <button className="btn detail-control__add" onClick={handleAddToCart}>
                                            <i className="fa-solid fa-basket-shopping"></i>
                                            <span className="detail-control__add--in-stock">Thêm vào giỏ hàng</span>
                                            {/* <span className="detail-control__add--sold-out">Sản phẩm đang tạm hết hàng</span>
                                        <span className="detail-control__add--stop-business">Ngừng kinh doanh</span> */}
                                        </button>
                                    </div>
                                    <div className="detail-desc">
                                        {product.desc}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-10 offset-lg-1">
                                <DetailReviews />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center h-100">
                        <h4 style={{color: "var(--text-color",}}>Không tìm thấy thông tin sản phẩm</h4>
                    </div>
                )
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalSuccess} onHide={() => setShowModalSuccess(false)}>
                <Modal.Header>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Đã thêm sản phẩm vào giỏ hàng</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModalSuccess(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}