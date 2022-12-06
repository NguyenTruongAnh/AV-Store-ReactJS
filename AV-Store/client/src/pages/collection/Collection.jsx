import './collection.css'
import './collectionResponsive.css'

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import Products from '../../components/products/Products'
import Loading from '../../components/loading/Loading'
import axios from "axios"
import { TabTitle } from '../../utils/GeneralFunction'

export default function Collections() {    
    const location = useLocation()
    const navigate = useNavigate()
    const slug = location.pathname.split("/")[2]
    const [category, setCategory] = useState({})
    const [isOpenSelect, setIsOpenSelect] = useState(false)
    const [selectedValue, setSelectedValue] = useState("Mới nhất")
    const [isLoading, setIsLoading] = useState(true)

    const handleSelect = (value) => {
        if (value !== selectedValue) {
            setSelectedValue(value)
        }
        setIsOpenSelect(false)
    }

    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await axios.get(`/categories/${slug}`)

                setTimeout(() => {
                    setIsLoading(false)
                }, 500)

                if (res.data !== null) {
                    TabTitle(`AV Store - Bộ sưu tập ${res.data.name.toLowerCase()}`)
                    setCategory(res.data)
                } else {
                    setCategory(res.data)
                }

            } catch (err) { }
        }

        setIsLoading(true)
        getCategory()
    }, [slug])

    return (
        <div className="collection">
            <div className="collection-filter">
                <h3 className="collection-filter__title">Sản phẩm:</h3>
                <div className={isOpenSelect ? "collection-filter__select active" : "collection-filter__select"}>
                    <div
                        className="collection-filter__selected"
                        onClick={() => setIsOpenSelect(!isOpenSelect)}
                    >
                        {selectedValue}
                        <i className="fa-solid fa-angle-down"></i>
                    </div>
                    <ul className="collection-filter__options">
                        <li onClick={() => handleSelect("Mới nhất")}>Mới nhất</li>
                        <li onClick={() => handleSelect("Giá từ thấp đến cao")}>Giá từ thấp đến cao</li>
                        <li onClick={() => handleSelect("Giá từ cao đến thấp")}>Giá từ cao đến thấp</li>
                        <li onClick={() => handleSelect("Giảm giá")}>Giảm giá</li>
                    </ul>
                </div>
            </div>
            <div className="collection-content">
                {isLoading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <Loading />
                    </div>
                ) : (
                    category ? (
                        <>
                            <div className="collection-content__title">
                                <h2>{category.name}:</h2>
                            </div>
                            <div className="collection-content__products">
                                <Products key={slug} cat={category._id} img={category.imgLarge} />
                            </div>
                        </>
                    ) : (
                        <h4 className="text-center mt-4" style={{color: "var(--text-color)",}}>Bộ sưu tập không tồn tại</h4>
                    )
                )}
            </div>
        </div>
    )
}