import './order.css'
import './orderResponsive.css'
import { useEffect, useState } from "react"
import axios from "axios"
import { formatter } from '../../utils/formatMoney'

export default function Order({ product }) {
    const [sample, setSample] = useState({ productId: {}, colorId: {}})
    useEffect(() => {
        const getSample = async () => {
            try {
                const res = await axios.get("/warehouse/" + product.sampleId)
                setSample(res.data)
            } catch (err) {}
        }
        getSample()
    }, [])
    return (
        <div className="order">
            <div className="order__detail">
                <img className="order__img" src={sample.image} alt="" />
                <div className="order__info">
                    <h5 className="order__name">{sample.productId.name}</h5>
                    <span className="order__quantity"><b>Số lượng:</b> {product.quantity}</span>
                    <span className="order__size"><b>Kích thước:</b> {product.size}</span>
                    <span className="order__color"><b>Màu sắc:</b> {sample.colorId.name}</span>
                </div>
            </div>
            {sample.productId.discount > 0 ? (<div className="order__price">
                <div className="order__price-old">
                    {formatter.format(sample.productId.price)}đ
                </div>
                <div className="order__price-current">
                    {`${formatter.format(Math.round((sample.productId.price * (1 - sample.productId.discount / 100)) / 1000) * 1000)}đ`}
                </div>
            </div>) : (<div className="order__price">
                <div className="order__price-current">
                    {formatter.format(sample.productId.price)}đ
                </div>
            </div>)}
            
        </div>
    )
}
