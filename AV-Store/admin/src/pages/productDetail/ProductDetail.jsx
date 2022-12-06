import './productDetail.css'
import './productDetailResponsive.css'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editProduct } from "../../redux/productApiCalls"
import { clear } from '../../redux/productRedux'
import axios from "axios"
import CurrencyFormat from 'react-currency-format'
import CustomModal from '../../components/customModal/CustomModal'
import Loading from '../../components/loading/Loading'
import { getColors } from "../../redux/colorApiCalls"
import { TabTitle } from '../../utils/GeneralFunction'

export default function DetailProduct() {
    TabTitle('AV Admin - Chi tiết sản phẩm')

    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const productId = location.pathname.split("/")[3]
    const [categorySizes, setCategorySizes] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const { isFetching, error, success, message, title } = useSelector((state) => state.product)
    const colors = useSelector((state) => state.color.colors)
    const clotheSizes = ['one size', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl']
    const [product, setProduct] = useState({})
    const [samples, setSamples] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Dùng chứa dữ liệu của product phục vụ việc edit (giúp việc phục hồi nếu ko muốn edit nữa)
    const [EditProduct, setEditProduct] = useState({})
    // Dùng chứa dữ liệu của product phục vụ việc edit (giúp việc phục hồi nếu ko muốn edit nữa)
    const [editSamples, setEditSamples] = useState([])
    // Dùng để chuyển đổi qua lại giữa chế độ view và edit
    const [mode, setMode] = useState('')

    // Dùng để chứa các size mới so với product ban đầu
    const [newProductSizes, setNewProductSizes] = useState([])
    // Dùng check xem mẫu mới tạo đã chọn màu chưa
    const [isCompleteSampleColor, setIsCompleteSampleColor] = useState(true)
    // Dùng check xem mẫu mới tạo đã tải ảnh lên chưa
    const [isCompleteSampleImg, setIsCompleteSampleImg] = useState(true)
    // Dùng để biết mẫu nào đang cần mở danh sách màu để chọn màu
    const [sampleIndexOpenColorList, setSampleIndexOpenColorList] = useState(-1)
    // Dùng để giữ các màu đã được chọn -> Tránh chọn trùng màu
    const [selectedColors, setSelectedColors] = useState([])
    // Dùng để giữ index của mẫu sản phẩm mới nhất đang được thêm vào
    const [currentSampleIndex, setCurrentSampleIndex] = useState(-1)

    // Dùng để chứa index của sample chọn xóa
    const [sampleIndexDelete, setSampleIndexDelete] = useState(-1)
    // Dùng để đóng mở delete sample modal
    const [isOpenDeleteSampleModal, setIsOpenDeleteSampleModal] = useState(false)
    // Dùng để chứa danh sách id sample bị xóa để gửi lên
    const [deleteSampleIds, setDeleteSampleIds] = useState([])

    const resetValue = useCallback(() => {
        setMode('')
        setEditProduct({})
        setCurrentSampleIndex(-1)
        setIsCompleteSampleColor(true)
        setIsCompleteSampleImg(true)
        setDeleteSampleIds([])
        setNewProductSizes([])
    }, [])

    const sortSizes = useCallback((sizes) => {
        sizes.sort((a, b) => {
            a = a.toLowerCase()
            b = b.toLowerCase()

            let nra = parseInt(a)
            let nrb = parseInt(b)

            if ((clotheSizes.indexOf(a) !== -1)) nra = NaN
            if ((clotheSizes.indexOf(b) !== -1)) nrb = NaN

            if (nrb === 0) return 1
            if (nra && !nrb || nra === 0) return -1
            if (!nra && nrb) return 1
            if (nra && nrb) {
                if (nra === nrb) {
                    return (a.substr(('' + nra).length)).localeCompare((a.substr(('' + nra).length)))
                } else {
                    return nra - nrb
                }
            } else {
                return clotheSizes.indexOf(a) - clotheSizes.indexOf(b)
            }
        })

        return sizes
    })

    // Xử lý khi chuyển từ chế độ view sang edit (nhấn button edit)
    const handleEdit = () => {
        setMode('edit')
        setEditProduct(JSON.parse(JSON.stringify(product)))
        setEditSamples(samples)
        setSelectedColors(samples.map((sample) => sample.colorId.hex))
    }

    // Xử lý xác nhận cập nhật
    const handleConfirm = async () => {
        let submitProduct = JSON.parse(JSON.stringify(EditProduct)) // Thông tin mới
        submitProduct.deleteSamples = [...deleteSampleIds] // Các id sample của product cũ sẽ bị xóa đi
        submitProduct.newSizes = [...newProductSizes] // Các kích thước mới của sản phẩm
        delete submitProduct.categoryId
        // Submit
        editProduct(dispatch, submitProduct, [...editSamples])
        resetValue()
    }

    // Xử lý thao tác hủy edit
    const handleCancel = () => {
        resetValue()
    }

    // Xử lý khi người dùng chọn các size mới cho sản phẩm (chỉ cho chọn các size hiện chưa có, size có rồi ko cho edit)
    const handleSelectSize = (selectedSize) => {
        if (!EditProduct.sizes.includes(selectedSize)) {
            setNewProductSizes((prev) => {
                let newSizes = [...prev, selectedSize]
                return sortSizes(newSizes)
            })

            setEditProduct((prev) => {
                // Lý do phải chuyển qua lại JSON là do useState chỉ render lại view khi dữ liệu của nó thay đổi
                // mà Object thì nó mang địa chỉ nên dù có đổi thông tin bên trong thì địa chỉ vẫn vậy nên chỉ còn
                // cách tạo một Object mới thông qua cách này (do chưa tìm dc cách nào hay hơn)
                const newEditProduct = JSON.parse(JSON.stringify(prev))
                newEditProduct.sizes = sortSizes([...newEditProduct.sizes, selectedSize])

                return newEditProduct
            })
        } else if (EditProduct.sizes.length > 1) {
            // Kiểm tra nếu size xóa nó nằm trong size gốc của product thì không cho xóa
            if (!product.sizes.includes(selectedSize)) {
                setEditProduct((prev) => {
                    const newEditProduct = JSON.parse(JSON.stringify(prev))
                    const index = newEditProduct.sizes.indexOf(selectedSize)
                    newEditProduct.sizes.splice(index, 1)

                    return newEditProduct
                })

                setNewProductSizes((prev) => {
                    const newSizes = [...prev]
                    const index = newSizes.indexOf(selectedSize)
                    newSizes.splice(index, 1)

                    return newSizes
                })
            }
        } else {
            alert('Bạn phải giữ lại tối thiểu 1 kích thước')
        }
    }

    // Xử lý thêm một mẫu sản phẩm mới
    const handleAddNewSample = () => {
        setIsCompleteSampleColor(false)
        setIsCompleteSampleImg(false)
        setCurrentSampleIndex(editSamples.length)
        setEditSamples((prev) => {
            const newEditSamples = [...prev]
            newEditSamples.push({
                colorId: {},
                image: '',
            })

            return newEditSamples
        })
    }

    // Xử lý mở bảng màu tại sample được chọn
    const handleOpenColorList = (sampleIndex) => {
        if (sampleIndexOpenColorList !== sampleIndex) {
            setSampleIndexOpenColorList(sampleIndex)
        } else {
            setSampleIndexOpenColorList(-1)
        }
    }

    // Xử lý chọn màu cho sample
    const handleSampleSelectColor = (sampleIndex, color) => {
        const sample = editSamples[sampleIndex]

        if (sample.colorId.hex !== color.hex && !selectedColors.includes(color.hex)) {
            if (sampleIndex === currentSampleIndex && !isCompleteSampleColor) {
                setIsCompleteSampleColor(true)
            }

            setSelectedColors((prev) => {
                if (Object.keys(sample.colorId).length !== 0) {
                    const index = prev.indexOf(sample.colorId.hex)
                    prev.splice(index, 1)
                }

                prev.push(color.hex)
                return prev
            })

            setEditSamples((prev) => {
                prev[sampleIndex].colorId.name = color.name
                prev[sampleIndex].colorId.hex = color.hex
                prev[sampleIndex].colorId._id = color._id
                prev[sampleIndex].changeColor = true
                return prev
            })

            setSampleIndexOpenColorList(-1)
        }
    }

    // Xử lý upload ảnh cho sample
    const handleSampleUploadImage = (sampleIndex, e) => {
        if (e.target.files && e.target.files[0]) {
            if (sampleIndex === currentSampleIndex && !isCompleteSampleImg) {
                setIsCompleteSampleImg(true)
            }

            setEditSamples((prev) => {
                const newEditSamples = [...prev]
                newEditSamples[sampleIndex].image = URL.createObjectURL(e.target.files[0])
                newEditSamples[sampleIndex].imageFile = e.target.files[0]
                return newEditSamples
            })
        }
    }

    // Xử lý select sample để xóa
    const handleSelectDeleteSample = (sampleIndex) => {
        if (editSamples.length > 1) {
            setSampleIndexDelete(sampleIndex)
            setIsOpenDeleteSampleModal(true)
        }
    }

    // Xử lý xóa sample
    const handleDeleteSample = () => {
        const deleteSample = editSamples[sampleIndexDelete]

        if (sampleIndexDelete === currentSampleIndex) {
            setIsCompleteSampleColor(true)
            setIsCompleteSampleImg(true)
        }

        if (deleteSample._id) {
            setDeleteSampleIds([...deleteSampleIds, deleteSample._id])
        }

        setCurrentSampleIndex(editSamples.length - 2)

        setSelectedColors((prev) => {
            prev.splice(sampleIndexDelete, 1)
            return prev
        })

        setEditSamples((prev) => {
            const newEditSamples = [...prev]
            newEditSamples.splice(sampleIndexDelete, 1)
            return newEditSamples
        })

        setIsOpenDeleteSampleModal(false)
        setSampleIndexDelete(-1)
    }

    // Đóng modal
    const handleCloseModal = () => {
        dispatch(clear())
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`/products/${productId}`)

                if (res.data) {
                    setProduct(res.data)
                    setCategorySizes(res.data.categoryId.sizes)
                    setCategoryName(res.data.categoryId.name)
                } else {
                    navigate("/404")
                }
            } catch (err) { }
        }

        const getSamples = async () => {
            try {
                const res = await axios.get(`/warehouse/productId/${productId}`)
                setSamples(res.data)

                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)

            } catch (err) { }
        }

        setIsLoading(true)
        getProduct()
        getSamples()
    }, [productId, success])

    useEffect(() => {
        getColors(dispatch)
    }, [])

    return (
        <div className="product-detail page">
            <h1 className="product-detail__title page__title">Thông tin sản phẩm: {product && product._id}</h1>
            <Link className="link product-detail__back page__back" to="/products">
                Quay lại
            </Link>
            <div className="product-detail__content">
                {isLoading ? (
                    <div className="d-flex justify-content-center">
                        <Loading />
                    </div>
                ) : (
                    product._id ? (
                        <div className="container-fluid">
                            <div className="row">

                                {/* Left */}
                                <div className="col-12 col-lg-5">
                                    {/* <div className="product-detail__rating">
                                    <b>({product.ratingAmount})</b> Đánh giá
                                    <i className="fa-solid fa-star"></i>
                                    <b>{product.ratingAverage}/5</b>
                                </div> */}

                                    <ul className="product-detail__info row">
                                        {/* Tên */}
                                        <li className="product-detail__info-item col-12">
                                            <span>Tên sản phẩm</span>
                                            {mode !== 'edit' ? (
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên sản phẩm"
                                                    value={product.name}
                                                    disabled
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên sản phẩm"
                                                    value={EditProduct.name}
                                                    autoComplete="off"
                                                    onChange={(e) => setEditProduct((prev) => {
                                                        prev.name = e.target.value
                                                        return JSON.parse(JSON.stringify(prev))
                                                    })}
                                                />
                                            )}
                                        </li>

                                        {/* Giá bán */}
                                        <li className="product-detail__info-item col-12 col-md-6">
                                            <span>Giá bán (VNĐ)</span>
                                            {mode !== 'edit' ? (
                                                <CurrencyFormat
                                                    value={product.price}
                                                    placeholder="Nhập giá sản phẩm"
                                                    thousandSeparator={true}
                                                    displayType={'input'}
                                                    disabled
                                                />
                                            ) : (
                                                <CurrencyFormat
                                                    value={EditProduct.price}
                                                    placeholder="Nhập giá sản phẩm"
                                                    thousandSeparator={true}
                                                    displayType={'input'}
                                                    onValueChange={(values) => {
                                                        const { value } = values
                                                        setEditProduct((prev) => {
                                                            if (value) {
                                                                prev.price = Math.abs(parseInt(value))
                                                            } else {
                                                                prev.price = 0
                                                            }

                                                            return JSON.parse(JSON.stringify(prev))
                                                        })
                                                    }}
                                                />
                                            )}
                                        </li>

                                        {/* Mức giảm giá */}
                                        <li className="product-detail__info-item col-12 col-md-6">
                                            <span>Giảm giá (%)</span>
                                            {mode !== 'edit' ? (
                                                <CurrencyFormat
                                                    value={product.discount}
                                                    placeholder="Nhập mức giảm giá"
                                                    thousandSeparator={true}
                                                    displayType={'input'}
                                                    disabled
                                                />
                                            ) : (
                                                <CurrencyFormat
                                                    value={EditProduct.discount}
                                                    placeholder="Nhập mức giảm giá"
                                                    thousandSeparator={true}
                                                    displayType={'input'}
                                                    onValueChange={(values) => {
                                                        const { value } = values
                                                        setEditProduct((prev) => {
                                                            const discount = parseInt(value)
                                                            if (discount >= 0 && discount <= 100) {
                                                                prev.discount = discount
                                                            } else {
                                                                prev.discount = 0
                                                            }
                                                            return JSON.parse(JSON.stringify(prev))
                                                        })
                                                    }}
                                                />
                                            )}
                                        </li>

                                        {/* Khối lượng */}
                                        <li className="product-detail__info-item col-12 col-md-6">
                                            <span>Khối lượng</span>
                                            {mode !== 'edit' ? (
                                                <CurrencyFormat
                                                    value={product.weight}
                                                    placeholder="Nhập khối lượng sản phẩm"
                                                    thousandSeparator={true}
                                                    displayType={'input'}
                                                    disabled
                                                />
                                            ) : (
                                                <CurrencyFormat
                                                    value={EditProduct.weight}
                                                    placeholder="Nhập khối lượng sản phẩm"
                                                    thousandSeparator={true}
                                                    displayType={'input'}
                                                    onValueChange={(values) => {
                                                        const { value } = values
                                                        setEditProduct((prev) => {
                                                            const weight = parseInt(value)
                                                            if (weight > -1) {
                                                                prev.weight = weight
                                                            } else {
                                                                prev.weight = 0
                                                            }
                                                            return JSON.parse(JSON.stringify(prev))
                                                        })
                                                    }}
                                                />
                                            )}
                                        </li>

                                        {/* Phân loại */}
                                        <li className="product-detail__info-item col-12 col-md-6">
                                            <span>Phân loại</span>
                                            <input
                                                type="text"
                                                placeholder="Nhập tên sản phẩm"
                                                value={categoryName}
                                                disabled
                                                autoComplete="off"
                                            />
                                        </li>

                                        {/* Kích thước */}
                                        <li className="product-detail__info-item col-12">
                                            <span>Kích thước</span>
                                            {mode !== 'edit' ? (
                                                <ul className="product-detail__info-sizes">
                                                    {product.sizes.map((size, index) => (
                                                        <li key={index} className="product-detail__info-size">
                                                            <span>{size}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <ul className="product-detail__info-sizes">
                                                    {categorySizes.map((size, index) => (
                                                        <li
                                                            key={index}
                                                            // className={`product-detail__info-size ${mode} ${product.sizes.includes(size) ? 'disabled' : EditProduct.sizes.includes(size) ? 'active' : ''}`}
                                                            className={`product-detail__info-size ${mode} ${EditProduct.sizes.includes(size) ? 'active' : ''}`}
                                                            onClick={() => handleSelectSize(size)}
                                                        >
                                                            <span>{size}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>

                                        {/* Mô tả */}
                                        <li className="product-detail__info-item col-12">
                                            <span>Mô tả</span>
                                            {mode !== 'edit' ? (
                                                <textarea
                                                    autoComplete="off"
                                                    placeholder="Nhập mô tả sản phẩm"
                                                    value={product.desc}
                                                    rows="3"
                                                    disabled>
                                                </textarea>
                                            ) : (
                                                <textarea
                                                    autoComplete="off"
                                                    placeholder="Nhập mô tả sản phẩm"
                                                    value={EditProduct.desc}
                                                    rows="3"
                                                    onChange={(e) => setEditProduct((prev) => {
                                                        prev.desc = e.target.value
                                                        return JSON.parse(JSON.stringify(prev))
                                                    })}>
                                                </textarea>
                                            )}
                                        </li>
                                    </ul>

                                    <div className="product-detail__control">
                                        {mode !== 'edit' ? (
                                            <>
                                                <button
                                                    className="product-detail__control-edit btn"
                                                    onClick={() => handleEdit()}
                                                >
                                                    Chỉnh sửa
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="product-detail__control-confirm btn"
                                                    onClick={() => handleConfirm()}
                                                    disabled={isFetching || !(isCompleteSampleColor && isCompleteSampleImg)}
                                                >
                                                    Xác nhận
                                                </button>
                                                <button
                                                    className="product-detail__control-cancel btn"
                                                    onClick={() => handleCancel()}
                                                >
                                                    Hủy bỏ
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="col-12 col-lg-7">
                                    <ul className="product-detail__summary">
                                        {/* Tổng số lượng đã bán */}
                                        <li className="product-detail__summary-item">
                                            <span>Tổng lượng bán ra</span>
                                            <span>
                                                <CurrencyFormat value={product.totalSales} displayType={'text'} thousandSeparator={true} />
                                            </span>
                                        </li>

                                        {/* Tổng số lượng đã bán trong tháng hiện tại */}
                                        <li className="product-detail__summary-item">
                                            <span>Lượng bán trong tháng</span>
                                            <span>
                                                <CurrencyFormat value={product.totalSalesInMonth} displayType={'text'} thousandSeparator={true} />
                                            </span>
                                        </li>

                                        {/* Tổng doanh thu có được */}
                                        <li className="product-detail__summary-item">
                                            <span>Tổng doanh thu</span>
                                            <span className="strong">
                                                <CurrencyFormat value={product.totalIncome} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                                            </span>
                                        </li>
                                    </ul>

                                    {/* Danh sách các mẫu */}
                                    <ul className="product-detail__samples">
                                        {mode !== 'edit' ? (
                                            samples.map((sample, index) => (
                                                <li
                                                    key={index}
                                                    className="product-detail__sample"
                                                >
                                                    <div className="product-detail__sample-left">
                                                        <div className="product-detail__sample-color">
                                                            {/* Hiển thị màu đã chọn */}
                                                            <div className="product-detail__sample-color-selected">
                                                                Màu sản phẩm:
                                                                <span style={{ backgroundColor: sample.colorId.hex }}></span>
                                                                {sample.colorId.name}
                                                            </div>
                                                        </div>

                                                        <div className="product-detail__sample-summary">
                                                            <span>Số lượng bán ra:</span>
                                                            <span>
                                                                <CurrencyFormat value={sample.totalSales} displayType="text" thousandSeparator={true} />
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="product-detail__sample-right">
                                                        <div className="product-detail__sample-img">
                                                            <img
                                                                className="product-detail__sample-img-view"
                                                                src={sample.image}
                                                                alt="Product"
                                                            />
                                                        </div>
                                                    </div>
                                                </li>
                                            ))) : (
                                            editSamples.map((sample, sampleIndex) => (
                                                <li
                                                    key={sampleIndex}
                                                    className="product-detail__sample"
                                                >
                                                    <div className="product-detail__sample-left">
                                                        <div className="product-detail__sample-color">
                                                            {/* Hiển thị màu đã chọn */}
                                                            <div className="product-detail__sample-color-selected">
                                                                Màu sản phẩm:
                                                                <span style={{ backgroundColor: sample.colorId.hex }}></span>
                                                                {sample.colorId.name}
                                                            </div>

                                                            {/* Button mở danh sách màu */}
                                                            <i
                                                                className={sampleIndexOpenColorList === sampleIndex ?
                                                                    "create-product__sample-color-open active fa-solid fa-chevron-down" :
                                                                    "create-product__sample-color-open fa-solid fa-chevron-down"}
                                                                onClick={() => handleOpenColorList(sampleIndex)}
                                                                title="Bảng màu"
                                                            ></i>

                                                            {/* Danh sách màu sẽ mở dựa vào index của thằng được tích */}
                                                            {sampleIndexOpenColorList === sampleIndex && (
                                                                <div className="product-detail__sample-color-list-wrapper">
                                                                    <ul className="product-detail__sample-color-list">
                                                                        {colors.map((color, colorIndex) => (
                                                                            <li
                                                                                className={sample.colorId.hex === color.hex ?
                                                                                    'active' :
                                                                                    selectedColors.includes(color.hex) ?
                                                                                        'selected' :
                                                                                        ''}
                                                                                style={{ borderColor: (color.hex === '#fff' || color.hex === '#ffffff' ? '#999' : color.hex) }}
                                                                                key={colorIndex}
                                                                                onClick={() => handleSampleSelectColor(sampleIndex, color)}
                                                                            >
                                                                                <span
                                                                                    style={{ backgroundColor: color.hex }}
                                                                                ></span>
                                                                                {color.name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="product-detail__sample-right">
                                                        <div className="product-detail__sample-img">
                                                            <img
                                                                className="product-detail__sample-img-view"
                                                                src={sample.image ? sample.image : "/images/no-image.jpg"}
                                                                alt="Product"
                                                            />
                                                            <label
                                                                htmlFor={`product-detail__sample-img-${sampleIndex}`}
                                                                className="product-detail__sample-img-icon"
                                                                title="Tải ảnh"
                                                            >
                                                                <i className="fas fa-camera"></i>
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id={`product-detail__sample-img-${sampleIndex}`}
                                                                className="product-detail__sample-img-file"
                                                                accept="image/*"
                                                                onChange={(e) => handleSampleUploadImage(sampleIndex, e)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Nút xóa */}
                                                    <div
                                                        className="product-detail__sample-delete"
                                                        title="Xóa sản phẩm"
                                                        onClick={() => handleSelectDeleteSample(sampleIndex)}
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </div>
                                                </li>
                                            )))}
                                    </ul>

                                    {/* Nút thêm mẫu sản phẩm mới */}
                                    {mode === 'edit' && isCompleteSampleColor && isCompleteSampleImg &&
                                        (
                                            <div
                                                className="create-product__btn-add"
                                                title="Thêm mẫu sản phẩm"
                                                onClick={() => handleAddNewSample()}
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <h4 className="text-center mt-4" style={{ color: "var(--text-color)", }}>Sản phẩm không tồn tại</h4>
                    )
                )}
            </div>

            {/* Delete sample modal */}
            <CustomModal
                title="Xóa mẫu sản phẩm"
                message="Bạn có thật sự muốn xóa mẫu sản phẩm này không?"
                isOpenModal={isOpenDeleteSampleModal}
                setIsOpenModal={setIsOpenDeleteSampleModal}
                handleDelete={handleDeleteSample}
            />

            {/* Update product modal */}
            <CustomModal
                title={title}
                message={message}
                isOpenModal={error ? error : success}
                setIsOpenModal={handleCloseModal}
            />
        </div>
    )

}
