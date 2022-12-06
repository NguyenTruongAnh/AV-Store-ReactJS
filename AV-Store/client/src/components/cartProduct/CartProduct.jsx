import './cartProduct.css'
import './cartProductResponsive.css'

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatter } from '../../utils/formatMoney'
import { useDispatch } from 'react-redux'
import { updateQuantity, deleteProduct } from '../../redux/cartRedux'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import Loading from '../loading/Loading'

export default function CartProduct({ sampleId, q, size }) {
    const [sample, setSample] = useState({ colorId: {}, productId: {} })
    const [quantity, setQuantity] = useState(q)
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()

    const handleQuantity = (type) => {
        if (type === "desc") {
            setQuantity(quantity - 1)
        }
        else {
            setQuantity(quantity + 1)
        }
        dispatch(updateQuantity({ sampleId, size, type }))
    }

    const handleDelete = () => {
        dispatch(deleteProduct({ sampleId, size, quantity }))
        setShowModal(false)
    }

    useEffect(() => {
        const getSample = async () => {
            try {
                const res = await axios.get(`/warehouse/${sampleId}`);
                setSample(res.data)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            } catch (err) { }
        }

        setIsLoading(true)
        getSample()
    }, [])

    return (
        <div className="cart-product">
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center w-100">
                    <Loading />
                </div>
            ) : (
                <>
                    <div className="cart-product__info">
                        <Link to={`/products/detail/${sample.productId._id}`}>
                            <img className="cart-product__img" src={sample.image} alt="" />
                        </Link>
                        <div className="cart-product__detail">
                            <span className="cart-product__name">
                                <b>Sản phẩm:</b>
                                <Link to={`/products/detail/${sample.productId._id}`}>
                                    {sample.productId.name}
                                </Link>
                            </span>
                            <span className="cart-product__id"><b>ID:</b> {sample.productId._id}</span>
                            <span className="cart-product__color"><b>Màu sắc:</b> {sample.colorId.name}</span>
                            <span className="cart-product__size"><b>Kích cỡ: </b> {size}</span>
                        </div>
                    </div>
                    <div className="cart-product__price">
                        <div className="cart-product__control">
                            <button className="cart-product__decrease btn"
                                onClick={() => handleQuantity("desc")} disabled={quantity == 1}>
                                <i className="fas fa-minus"></i>
                            </button>
                            <span className="cart-product__amount">{quantity}</span>
                            <button className="cart-product__increase btn"
                                onClick={() => handleQuantity("asc")}>
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                        {sample.productId.discount > 0 ?
                            (<div className="cart-product__payment">
                                <div className="cart-product__payment-current">
                                    {`${formatter.format(Math.round((sample.productId.price * (1 - sample.productId.discount / 100)) / 1000) * 1000)}đ`}
                                </div>
                                <div className="cart-product__payment-old">
                                    {formatter.format(sample.productId.price)}đ
                                </div>
                            </div>) :
                            (<div className="cart-product__payment">
                                <div className="cart-product__payment-current">
                                    {formatter.format(sample.productId.price)}đ
                                </div>
                            </div>)
                        }

                    </div>
                    <button className="cart-product__delete"
                        onClick={() => setShowModal(true)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Xóa sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có muốn xóa sản phẩm <strong>{sample.productId.name}</strong> không ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete}>
                        Xác nhận
                    </Button>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
