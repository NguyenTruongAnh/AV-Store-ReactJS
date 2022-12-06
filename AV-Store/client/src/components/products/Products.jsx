import './products.css'
import './productsResponsive.css'
import Product from '../product/Product'
import Loading from '../../components/loading/Loading'
import { useState, useEffect } from 'react'
import axios from "axios";

export default function Products({ cat, img }) {
    const [products, setProducts] = useState([])
    const [showBtn, setShowBtn] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    const handleSeeMore = () => {
        const getProductsMore = async () => {
            try {
                const res = await axios.get(`/products?category=${cat}&page=${(products.length / 10) + 1}`);
                if (res.data.length < 10) {
                    setShowBtn(false)
                }
                setProducts(prevProducts => [...prevProducts, ...res.data])

            } catch (err) { }
        }

        getProductsMore()
    }

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(`/products?category=${cat}&page=1`);
                setProducts(res.data)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
                if (res.data.length < 10) setShowBtn(false)
            } catch (err) { }
        }

        setIsLoading(true)
        getProducts()
    }, [cat])

    return (
        <div className="products">
            <div className="container-fluid px-0">
                <div className="row mx-0">
                    <div className="col-6 col-md-4 col-lg-4 col-xl-2 mb-5 px-2">
                        <img className="products-img" src={img} alt="" />
                    </div>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center col-6 col-lg-4 col-xl-2 mb-5 px-2">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            {products.map(product => (
                                <div className="col-6 col-md-4 col-lg-4 col-xl-2 mb-5 px-2">
                                    <Product product={product} />
                                </div>)
                            )}
                            {showBtn && (
                                <div className="col-6 col-lg-4 col-xl-2 mb-5 px-2">
                                    <div className="products-more d-flex align-items-center justify-content-center">
                                        <button type="button"
                                            class="btn btn-outline-secondary"
                                            onClick={handleSeeMore}>
                                            Xem thêm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}