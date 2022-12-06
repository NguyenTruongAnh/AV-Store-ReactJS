import './orderProduct.css'
import './orderProductResponsive.css'

import CurrencyFormat from 'react-currency-format'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import axios from "axios";

export default function OrderProduct({ product }) {
    const [sample, setSample] = useState({ productId: {}, colorId: {}})

    useEffect(() => {
        const getSample = async () => {
            try {
                const res = await axios.get("/warehouse/" + product.sampleId);
                setSample(res.data);
            } catch (err) {}
        }
        getSample()
    }, [])

    return (
        <div
            className="order-product"
        >
            <div className="order-product__left">
                <img className="order-product__img" src={sample.image} alt="Sản phẩm" />
                <div className="order-product__info">
                    <h5 className="order-product__name">
                        <Link to={`/products/detail/${sample.productId._id}`} target="_blank">
                            {sample.productId.name}
                        </Link>
                    </h5>
                    <span className="order-product__quantity">
                        <b className="mr-1">Số lượng:</b>
                        <CurrencyFormat
                            value={product.quantity}
                            displayType={'text'}
                            thousandSeparator={true}
                        />
                    </span>
                    <span className="order-product__size">
                        <b className="mr-1">Kích thước:</b>
                        {product.size}
                    </span>
                    <span className="order-product__color">
                        <b className="mr-1">Màu sắc:</b>
                        <span style={{ backgroundColor: sample.colorId.hex }}></span>
                        {sample.colorId.name}
                    </span>
                </div>
            </div>
            <div className="order-product__right">
                {sample.productId.discount > 0 ? (
                    <div className="order-product__price">
                        <CurrencyFormat
                            className="order-product__price-current"
                            value={Math.round((sample.productId.price * (1 - sample.productId.discount / 100)) / 1000) * 1000}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' đ'}
                        />
                        <CurrencyFormat
                            className="order-product__price-old"
                            value={sample.productId.price}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' đ'}
                        />
                    </div>
                ) : (<div className="order-product__price">
                    <CurrencyFormat
                        className="order-product__price-current"
                        value={sample.productId.price}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' đ'}
                    />
                    </div>
                )}
                
            </div>
            </div>
    )
}
