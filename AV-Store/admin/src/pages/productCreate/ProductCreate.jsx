import './productCreate.css'
import './productCreateResponsive.css'

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/categoryApiCalls";
import { getColors } from "../../redux/colorApiCalls";
import { createProduct } from "../../redux/productApiCalls";
import { clear } from '../../redux/productRedux'
import CurrencyFormat from 'react-currency-format'
import CustomModal from '../../components/customModal/CustomModal'
import app from "../../config/firebase"
import { getStorage, ref, getDownloadURL, uploadBytes  } from "firebase/storage";
import { TabTitle } from '../../utils/GeneralFunction';

export default function CreateProduct() {
    TabTitle('AV Admin - Thêm sản phẩm')

    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productDesc, setProductDesc] = useState('')
    const [productWeight, setProductWeight] = useState('')
    const dispatch = useDispatch();
    const storage = getStorage(app);
    // ------- Type -------
    const [productType, setProductType] = useState('')

    const categories = useSelector((state) => state.category.categories)
    const { isFetching, error, success, message, title } = useSelector((state) => state.product);
    // ------- Size -------
    const sizes = categories.reduce((obj, cur) => (
        {
            ...obj,
            [cur._id]: cur.sizes.reduce((obj, cur, index) => ({...obj, [cur]: index+1}), {})
        } 
    ), {})

    const [selectedSizes, setSelectedSizes] = useState([])
    const [isSelectedAllSize, setIsSelectedAllSize] = useState(false)

    // ------- Sample -------
    const colors = useSelector((state) => state.color.colors)
    
    // Dùng check xem mẫu mới tạo đã chọn màu chưa
    const [isCompleteSampleColor, setIsCompleteSampleColor] = useState(true)
    // Dùng check xem mẫu mới tạo đã tải ảnh lên chưa
    const [isCompleteSampleImg, setIsCompleteSampleImg] = useState(true)
    // Dùng để biết mẫu nào đang cần mở danh sách màu để chọn màu
    const [sampleIndexOpenColorList, setSampleIndexOpenColorList] = useState(-1)
    // Dùng để giữ các màu đã được chọn -> Tránh chọn trùng màu
    const [selectedColors, setSelectedColors] = useState([])
    // Danh sách các mẫu sản phẩm
    const [samples, setSamples] = useState([])
    // Dùng để giữ index của mẫu sản phẩm mới nhất
    const [currentSampleIndex, setCurrentSampleIndex] = useState(-1)

    // ----- Hàm xử lý chọn type
    const handleSelectProductType = (type) => {
        setProductType(type)

        // Reset việc chọn size
        setIsSelectedAllSize(false)
        setSelectedSizes([])

        // Reset việc thêm mẫu sản phẩm
        setIsCompleteSampleColor(true)
        setIsCompleteSampleImg(true)
        setSampleIndexOpenColorList(-1)
        setSelectedColors([])
        setSamples([])
        setCurrentSampleIndex(-1)
    }

    // ----- Hàm xử lý chọn size
    const handleSelectSize = (size) => {
        if (!selectedSizes.includes(size)) {
            setSelectedSizes((prev) => {
                let newSizes = [...prev, size]
                newSizes = newSizes.sort((a, b) => sizes[productType][a] - sizes[productType][b])

                if (newSizes.length === Object.keys(sizes[productType]).length) {
                    setIsSelectedAllSize(true)
                }

                return newSizes
            })
        } else {
            setSelectedSizes((prev) => {
                const newSizes = [...prev]
                const index = prev.indexOf(size)
                newSizes.splice(index, 1)
                setIsSelectedAllSize(false)

                return newSizes
            })
        }
    }

    const handleSelectAllSize = () => {
        // Nếu hiện tại đang là false -> chọn thành true -> thêm tất cả size vào selectedSizes
        if (!isSelectedAllSize) {
            setSelectedSizes(Object.keys(sizes[productType]))
            setIsSelectedAllSize(true)
        } else {
            setSelectedSizes([])
            setIsSelectedAllSize(false)
        }
    }

    // ----- Hàm xử lý thêm các mẫu sản phẩm
    const handleAddNewSample = () => {
        setIsCompleteSampleColor(false)
        setIsCompleteSampleImg(false)
        setCurrentSampleIndex(samples.length)
        setSamples((prev) => [...prev, { color: {}, img: {} }])
    }

    const handleOpenColorList = (sampleIndex) => {
        if (sampleIndexOpenColorList !== sampleIndex) {
            setSampleIndexOpenColorList(sampleIndex)
        } else {
            setSampleIndexOpenColorList(-1)
        }
    }

    const handleSampleSelectColor = (sampleIndex, color) => {
        const sample = samples[sampleIndex]

        if (sample.color.hex !== color.hex && !selectedColors.includes(color.hex)) {
            if (sampleIndex === currentSampleIndex && !isCompleteSampleColor) {
                setIsCompleteSampleColor(true)
            }

            setSelectedColors((prev) => {
                if (Object.keys(sample.color).length !== 0) {
                    const index = prev.indexOf(sample.color.hex)
                    prev.splice(index, 1)
                }

                prev.push(color.hex)
                return prev
            })

            setSamples((prev) => {
                prev[sampleIndex].color = color
                return prev
            })

            setSampleIndexOpenColorList(-1)
        }
    }

    const handleDeleteSample = (sampleIndex) => {
        if (currentSampleIndex === sampleIndex) {
            setIsCompleteSampleColor(true)
            setIsCompleteSampleImg(true)
        }

        setCurrentSampleIndex(samples.length - 2)

        setSelectedColors((prev) => {
            prev.splice(sampleIndex, 1)
            return prev
        })

        setSamples((prev) => {
            const newSamples = [...prev]
            newSamples.splice(sampleIndex, 1)
            return newSamples
        })
    }

    const handleSampleUploadImage = (sampleIndex, e) => {
        if (e.target.files && e.target.files[0]) {
            if (sampleIndex === currentSampleIndex && !isCompleteSampleImg) {
                setIsCompleteSampleImg(true)
            }

            setSamples((prev) => {
                const newSamples = [...prev]
                newSamples[sampleIndex].img.file = e.target.files[0]
                newSamples[sampleIndex].img.src = URL.createObjectURL(e.target.files[0])
                return newSamples
            })
        }
    }

    const checkSubmitValue = () => {
        let check = true
        if (productType) {
            if (!productName || !productPrice || !productDesc || samples.length < 1 ||
                !isCompleteSampleColor || !isCompleteSampleImg) {
                check = false
            }

            if (sizes[productType].length > 0 && selectedSizes.length < 1) {
                check = false
            }
        } else {
            check = false
        }
        return check
    }

    // ---- Submit
    const handleSubmit = async () => {   
        const product = {
            name: productName,
            desc: productDesc,
            price: productPrice,
            sizes: selectedSizes,
            weight: parseInt(productWeight),
            categoryId: parseInt(productType),
            colors: samples.map((s) => s.color._id),
        }

        createProduct(dispatch, product, samples)
        setProductName('')
        setProductPrice('')
        setProductType('')
        setProductWeight('')
        setSelectedSizes('')
        setProductDesc('')
        setSamples([])
    }

    const handleCloseModal = () => {
        dispatch(clear())
    }

    useEffect(() => {
        getCategories(dispatch)
        getColors(dispatch)
    }, [])

    return (
        <div className="product-create page">
            <h1 className="product-create__title page__title">Thêm sản phẩm</h1>
            <Link className="product-create__back page__back" to="/products">
                Quay lại
            </Link>
            <div className="product-create__content">
                <div className="container-fluid">
                    <div className="row">
                        {/* Left */}
                        <div className="col-12 col-lg-5">
                            <div className="product-create__form">
                                <ul className="product-create__list row">
                                    {/* Tên sản phẩm */}
                                    <li className="product-create__item col-12">
                                        <span>Tên sản phẩm</span>
                                        <input
                                            type="text"
                                            placeholder="Nhập tên sản phẩm"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                        />
                                    </li>

                                    {/* Giá sản phẩm */}
                                    <li className="product-create__item col-12 col-md-6">
                                        <span>Giá bán (VNĐ)</span>
                                        <CurrencyFormat value={productPrice} thousandSeparator={true} placeholder="Nhập giá bán" onValueChange={(values) => {
                                            const { value } = values
                                            if (value) {
                                                if (parseInt(value) <= 0) {
                                                    setProductPrice(Math.abs(parseInt(value)) + 1)
                                                } else {
                                                    setProductPrice(Math.abs(parseInt(value)))
                                                }
                                            } else {
                                                setProductPrice(0)
                                            }
                                        }} />
                                    </li>

                                    {/* Phân loại sản phẩm */}
                                    <li className="product-create__item col-12 col-md-6">
                                        <span>Phân loại</span>
                                        <select name="" id="" className="" onChange={(e) => handleSelectProductType(e.target.value)}>
                                            <option value="">--Chọn loại hàng hóa--</option>
                                            {categories.map((category)=> (<option key={category._id} value={category._id}>{category.name}</option>))}
                                        </select>
                                    </li>

                                    {/* Khối lượng sản phẩm */}
                                    <li className="product-create__item col-12 col-md-6">
                                        <span>Khối lượng</span>
                                        <CurrencyFormat value={productWeight} thousandSeparator={true} placeholder="Nhập khối lượng" onValueChange={(values) => {
                                            const { value } = values
                                            if (value) {
                                                if (parseInt(value) <= 0) {
                                                    setProductWeight(Math.abs(parseInt(value)) + 1)
                                                } else {
                                                    setProductWeight(Math.abs(parseInt(value)))
                                                }
                                            } else {
                                                setProductWeight(0)
                                            }
                                        }} />
                                    </li>

                                    {/* Kích thước sản phẩm */}
                                    {sizes[productType] && Object.keys(sizes[productType]).length > 0 &&
                                        (
                                            <li className="product-create__item col-12">
                                                <span>Kích thước</span>
                                                <ul className="product-create__item-sizes">
                                                    <li
                                                        className={`product-create__item-size ${isSelectedAllSize && 'active'}`}
                                                        data-size="3XL"
                                                        onClick={(e) => handleSelectAllSize(e)}
                                                    >
                                                        All
                                                    </li>
                                                    {Object.keys(sizes[productType]).map((size, index) => (
                                                        <li
                                                            key={index}
                                                            className={`product-create__item-size ${selectedSizes.includes(size) && 'active'}`}
                                                            onClick={() => handleSelectSize(size)}
                                                        >
                                                            {size}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        )
                                    }

                                    {/* Mô tả sản phẩm */}
                                    <li className="product-create__item col-12">
                                        <span>Mô tả sản phẩm</span>
                                        <textarea
                                            autoComplete="off"
                                            placeholder="Nhập mô tả sản phẩm"
                                            rows="3"
                                            value={productDesc}
                                            onChange={(e) => setProductDesc(e.target.value)}
                                        >
                                        </textarea>
                                    </li>
                                </ul>

                                {/* Button xác nhận */}
                                <div className="d-flex justify-content-center">
                                    {checkSubmitValue() ? (
                                        <button className="product-create__confirm" onClick={() => handleSubmit()} disabled={isFetching}>Xác nhận</button>
                                    ) : (
                                        <button className="product-create__confirm btn disabled">Xác nhận</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="col-12 col-lg-7">
                            <ul className="product-create__samples">
                                {samples.map((sample, sampleIndex) => (
                                    <li
                                        className="product-create__sample"
                                        key={sampleIndex}
                                    >
                                        <div className="product-create__sample-color">
                                            {/* Hiển thị màu đã chọn */}
                                            <div className="product-create__sample-color-selected">
                                                Màu sản phẩm:
                                                <span style={{ backgroundColor: sample.color.hex }}></span>
                                                {sample.color.name}
                                            </div>

                                            {/* Button mở danh sách màu */}
                                            <i
                                                className={sampleIndexOpenColorList === sampleIndex ?
                                                    "product-create__sample-color-open active fa-solid fa-chevron-down" :
                                                    "product-create__sample-color-open fa-solid fa-chevron-down"}
                                                onClick={() => handleOpenColorList(sampleIndex)}
                                                title="Bảng màu"
                                            ></i>

                                            {/* Danh sách màu sẽ mở dựa vào index của thằng được tích */}
                                            {sampleIndexOpenColorList === sampleIndex && (
                                                <div className="product-create__sample-color-list-wrapper">
                                                    <ul className="product-create__sample-color-list">
                                                        {colors.map((color, colorIndex) => (
                                                            <li
                                                                className={sample.color.hex === color.hex ?
                                                                    'active' :
                                                                    selectedColors.includes(color.hex) ?
                                                                        'selected' :
                                                                        ''}
                                                                key={colorIndex}
                                                                style={{ borderColor: (color.hex === '#fff' || color.hex === '#ffffff' ? '#999' : color.hex) }}
                                                                onClick={() => handleSampleSelectColor(sampleIndex, color)}
                                                            >
                                                                <span
                                                                    className="active"
                                                                    style={{ backgroundColor: color.hex }}
                                                                ></span>
                                                                {color.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <div className="product-create__sample-img">
                                            <img
                                                className="product-create__sample-img-view"
                                                src={sample.img.src ? sample.img.src : "/images/no-image.jpg"}
                                                alt="Product"
                                            />
                                            <label
                                                htmlFor={`product-create__sample-img-${sampleIndex}`}
                                                className="product-create__sample-img-icon"
                                                title="Tải ảnh"
                                            >
                                                <i className="fas fa-camera"></i>
                                            </label>
                                            <input
                                                type="file"
                                                id={`product-create__sample-img-${sampleIndex}`}
                                                className="product-create__sample-img-file"
                                                accept="image/*"
                                                onChange={(e) => handleSampleUploadImage(sampleIndex, e)}
                                            />
                                        </div>

                                        <div
                                            className="product-create__sample-delete"
                                            title="Xóa sản phẩm"
                                            onClick={() => handleDeleteSample(sampleIndex)}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Nút thêm mẫu sản phẩm mới */}
                            {isCompleteSampleColor && isCompleteSampleImg &&
                                (
                                    <div
                                        className="product-create__btn-add"
                                        title="Thêm sản phẩm"
                                        onClick={() => handleAddNewSample()}
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                {/* Modal */}
                <CustomModal
                    title={title}
                    message={message}
                    isOpenModal={error ?  error : success}
                    setIsOpenModal={handleCloseModal}
                />
            </div>
        </div>
    )
}
