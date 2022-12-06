import './category.css'
import './categoryResponsive.css'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, editCategory, deleteCategory } from "../../redux/categoryApiCalls"
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { useDispatch, useSelector } from "react-redux"
import CustomModal from '../../components/customModal/CustomModal'
import Loading from '../../components/loading/Loading'
import { clear } from '../../redux/categoryRedux'
import app from "../../config/firebase"
import { TabTitle } from '../../utils/GeneralFunction'

export default function Category() {
    TabTitle('AV Admin - Danh mục sản phẩm')

    let categories = useSelector((state) => state.category.categories)
    const clotheSizes = ['one size', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl']
    const [size, setSize] = useState()
    const [name, setName] = useState([])
    const [sizes, setSizes] = useState([])
    const [largeImage, setLargeImage] = useState('')
    const [largeImageFile, setLargeImageFile] = useState('')
    const [smallImage, setSmallImage] = useState('')
    const [smallImageFile, setSmallImageFile] = useState('')
    const [mode, setMode] = useState('create')
    const [categoryEditId, setCategoryEditId] = useState('')
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [deleteCategoryId, setDeleteCategoryId] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()
    const { isFetching, error, success, message, title } = useSelector((state) => state.category)
    const storage = getStorage(app)

    useEffect(() => {
        if (isFetching) {
            setIsLoading(true)
        } else {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [isFetching])

    const handleAddSize = (e) => {
        const keyCode = e.keyCode

        if (keyCode === 13) {
            if (size.trim()) {
                setSizes((prev) => {
                    const newSizes = [...prev]
                    newSizes.push(size.trim())
                    newSizes.sort((a, b) => {
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

                    return newSizes
                })
            }

            setSize("")
        }
    }

    const handleDeleteSize = (sizeIndex) => {
        setSizes((prev) => {
            const newSizes = [...prev]
            newSizes.splice(sizeIndex, 1)
            return newSizes
        })
    }

    const handleUploadImage = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'large') {
                setLargeImage(URL.createObjectURL(e.target.files[0]))
                setLargeImageFile(e.target.files[0])
            } else if (type === 'small') {
                setSmallImage(URL.createObjectURL(e.target.files[0]))
                setSmallImageFile(e.target.files[0])
            }
        }
    }

    const handleEdit = (id) => {
        if (categoryEditId !== id) {
            const editCategory = categories.filter(category => category._id === id)[0]
            setName(editCategory.name)
            setSizes(editCategory.sizes)
            setLargeImage(editCategory.imgLarge)
            setSmallImage(editCategory.imgSmall)
            setMode('edit')
            setCategoryEditId(id)
        }
    }

    const handleReset = () => {
        setName('')
        setSizes([])
        setLargeImage('')
        setLargeImageFile('')
        setSmallImage('')
        setSmallImageFile('')
        setMode('')
        setCategoryEditId('')
    }

    const handleUpdate = () => {
        if (name && sizes) {
            const files = []
            if (largeImageFile) {
                files.push(largeImageFile)
            }

            if (smallImageFile) {
                files.push(smallImageFile)
            }

            const categoryEdit = { name, sizes }

            editCategory(dispatch, categoryEdit, categoryEditId, files, [largeImage, smallImage])
            handleReset()
        }
    }

    const handleConfirm = () => {
        const category = { name, sizes }
        createCategory(dispatch, category, [largeImageFile, smallImageFile])
        handleReset()
    }

    const handleSelectDelete = (id) => {
        setDeleteCategoryId(id)
        setIsOpenModal(true)
    }

    const handleDelete = () => {
        deleteCategory(dispatch, deleteCategoryId)
        setDeleteCategoryId('')
        setIsOpenModal(false)
    }

    const handleCloseModal = () => {
        dispatch(clear())
    }

    useEffect(() => {
        getCategories(dispatch)
    }, [dispatch])

    return (
        <div className="category page">
            <h1 className="category__title page__title">Danh mục sản phẩm</h1>
            <div className="category__content">
                <div className="container-fluid">
                    <div className="row">
                        {/* Left */}
                        <div className="col-12 col-md-4 col-lg-4 mb-5">
                            <div className="category__form">
                                {/* Tên danh mục */}
                                <div className="category__form-item">
                                    <span>Tên danh mục</span>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên danh mục"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {/* Các kích cỡ của danh mục */}
                                <div className="category__form-item">
                                    <span>Kích thước</span>
                                    <input
                                        type="text"
                                        placeholder="Nhập kích thước danh mục"
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        onKeyUp={(e) => handleAddSize(e)}
                                    />
                                    <ul>
                                        {sizes.map((size, index) => (
                                            <li key={index}>
                                                {size}
                                                <span onClick={() => handleDeleteSize(index)}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Hình ảnh lớn của danh mục */}
                                <div className="category__form-item">
                                    <span>Hình ảnh lớn</span>
                                    <div className="category__form-img">
                                        <img
                                            className="category__form-img-view"
                                            src={largeImage ? largeImage : "/images/no-image.jpg"}
                                            alt="Product"
                                        />
                                        <label htmlFor="category__form-img-file" className="category__form-img-icon">
                                            <i className="fas fa-camera"></i>
                                        </label>
                                        <input
                                            type="file"
                                            id="category__form-img-file"
                                            className="category__form-img-file"
                                            accept="image/*"
                                            onChange={(e) => handleUploadImage(e, 'large')}
                                        />
                                    </div>
                                </div>

                                {/* Hình ảnh nhỏ của danh mục */}
                                <div className="category__form-item">
                                    <span>Hình ảnh nhỏ</span>
                                    <div className="category__form-img">
                                        <img
                                            className="category__form-img-view category__form-img-view--small"
                                            src={smallImage ? smallImage : "/images/no-image.jpg"}
                                            alt="Product"
                                        />
                                        <label htmlFor="category__form-img-file-min" className="category__form-img-icon">
                                            <i className="fas fa-camera"></i>
                                        </label>
                                        <input
                                            type="file"
                                            id="category__form-img-file-min"
                                            className="category__form-img-file"
                                            accept="image/*"
                                            onChange={(e) => handleUploadImage(e, 'small')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="col-12 col-md-8">
                            <div className="category__control">
                                {mode !== 'edit' ? (
                                    (name && sizes.length > 0 && largeImage && smallImage) ? (
                                        <button className="category__control-confirm" onClick={() => handleConfirm()} disabled={isFetching}>Xác nhận</button>
                                    ) : (
                                        <button className="category__control-confirm disabled">Xác nhận</button>
                                    )
                                ) : (
                                    <button className="category__control-update" onClick={() => handleUpdate()} disabled={isFetching}>Chỉnh sửa</button>
                                )}
                                <button className="category__control-reset" onClick={() => handleReset()}>Reset</button>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center mt-5">
                                    <Loading />
                                </div>
                            ) : (
                                <ul className="category__list">
                                    {categories.map((category) => (
                                        <li
                                            className={categoryEditId === category._id ? "category__item edit" : "category__item"}
                                            key={category._id}
                                        >
                                            <div className="category__item-left">
                                                <div className="category__item-content">
                                                    <div className="mb-1 category__item-content-title">
                                                        {category.name}
                                                    </div>
                                                    <div className="mb-1 category__item-content-size">
                                                        Kích thước:
                                                        <ul>
                                                            {category.sizes.map((size, index) => (
                                                                <li key={index}>{size}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="mb-1 category__item-content-img">
                                                        <img src={category.imgSmall} alt="SmallImage" />
                                                    </div>
                                                </div>
                                                <div className="category__item-control">
                                                    <button
                                                        className="category__item-control-edit"
                                                        onClick={() => handleEdit(category._id)}
                                                    >
                                                        Chỉnh sửa
                                                    </button>
                                                    <button
                                                        className="category__item-control-delete"
                                                        onClick={() => handleSelectDelete(category._id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="category__item-right">
                                                <img src={category.imgLarge} alt="LargeImage" className="category__item-img" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Modal Delete */}
                            <CustomModal
                                title={'Xóa danh mục'}
                                message={'Bạn có thật sự muốn xóa danh mục này?'}
                                isOpenModal={isOpenModal}
                                setIsOpenModal={setIsOpenModal}
                                handleDelete={handleDelete}
                            />

                            {/* Modal */}
                            <CustomModal
                                title={title}
                                message={message}
                                isOpenModal={error ? error : success}
                                setIsOpenModal={handleCloseModal}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}