import './product.css'
import './productResponsive.css'

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../../components/pagination/Pagination'
import CustomSelection from '../../components/customSelection/CustomSelection'
import CustomModal from '../../components/customModal/CustomModal'
import Loading from '../../components/loading/Loading'
import { getProducts, getMaxPage } from '../../redux/productApiCalls'
import { getCategories } from "../../redux/categoryApiCalls"
import { deleteProduct } from "../../redux/productApiCalls"
import { clear } from '../../redux/productRedux'
import CurrencyFormat from 'react-currency-format'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Product() {
    TabTitle('AV Admin - Sản phẩm')

    const dispatch = useDispatch()
    const products = useSelector((state) => state.product.products)
    const categories = useSelector((state) => state.category.categories)
    const maxPage = useSelector((state) => state.product.maxPage)
    const { error, success, message, title, isFetching } = useSelector((state) => state.product)
    const options = ["Tất cả"].concat(categories.map((category) => category.name))
    const [filterProducts, setFilterProducts] = useState([])
    const [isOpenSelection, setIsOpenSelection] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [selectionValue, setSelectionValue] = useState("Tất cả")
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [deleteProductId, setDeleteProductId] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    let params = new URLSearchParams(location.search)
    const [currentPage, setCurrentPage] = useState({
        page: 1,
    })

    // Xử lý select danh mục
    const handleSelection = (value) => {
        if (value !== selectionValue) {
            setSelectionValue(value)
            setFilterProducts(products.filter((product) => product.categoryId.name === value))
        }
        setIsOpenSelection(false)
    }

    // Xử lý search
    const handleSearchEnter = (keyCode) => {
        if (keyCode === 13) {
            if (searchValue.trim().length > 0) {
                setFilterProducts(products.filter((product) => product.name.toLowerCase().indexOf(searchValue.trim()) > -1))
            }
        }
    }

    // Xử lý Page
    const handlePreviousPage = () => {
        if (currentPage.page > maxPage) {
            navigate(`/products?page=${maxPage}`)
        } else {
            navigate(`/products?page=${currentPage.page - 1}`)
        }
    }

    const handleNextPage = () => {
        if (currentPage.page < 1) {
            navigate(`/products?page=${1}`)
        } else {
            navigate(`/products?page=${currentPage.page + 1}`)
        }
    }

    const handlePageEnter = (e) => {
        if (e.keyCode === 13 && currentPage.page) {
            console.log(currentPage.page)
            navigate(`/products?page=${currentPage.page}`)
        }
    }

    const handleDeleteProduct = (id) => {
        setDeleteProductId(id)
        setIsOpenModal(true)
    }

    const handleDelete = async () => {
        deleteProduct(dispatch, deleteProductId)
        setIsOpenModal(false)
    }

    const handleCloseModal = () => {
        dispatch(clear())
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })

        if (isNaN(params.get('page'))) {
            navigate(`/products?page=${1}`)
        } else {
            const page = params.get('page') && params.get('page') !== "0" ? parseInt(params.get('page')) : 1
            setCurrentPage({
                page
            })

            getProducts(dispatch, page)
        }
    }, [params.get('page'), success])

    useEffect(() => {
        getCategories(dispatch)
        getMaxPage(dispatch)
    }, [])

    useEffect(() => {
        if (isFetching) {
            setIsLoading(true)
        } else {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [isFetching])

    return (
        <div className="product page">
            <h1 className="product__title page__title">Danh sách sản phẩm</h1>
            <Link className="link product__btn" to="/products/create">
                Thêm sản phẩm
            </Link>
            <div className="product__control">
                <div className="product__filter">
                    <h4 className="product__filter-title">Danh mục:</h4>
                    <CustomSelection
                        options={options}
                        isOpenSelection={isOpenSelection}
                        setIsOpenSelection={setIsOpenSelection}
                        selectionValue={selectionValue}
                        handleSelection={handleSelection}
                    />
                </div>
                <div className="product__search">
                    <div className="product__search-wrapper">
                        <input
                            className="product__search-input"
                            type="text"
                            placeholder="Nhập tên sản phẩm..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyUp={(e) => handleSearchEnter(13)}
                        />
                        <i
                            className="product__search-btn fa-solid fa-magnifying-glass"
                            onClick={() => handleSearchEnter(13)}
                        ></i>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table product__table">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center" style={{ width: 80, }}>ID</th>
                            <th scope="col" className="text-left" style={{ width: 400, }}>Sản phẩm</th>
                            <th scope="col" className="text-center" style={{ width: 120, }}>Phân loại</th>
                            <th scope="col" className="text-center" style={{ width: 120, }}>Giảm giá</th>
                            <th scope="col" className="text-center">Giá bán</th>
                            <th scope="col" className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6">
                                    <div className="d-flex justify-content-center">
                                        <Loading />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            selectionValue !== "Tất cả" || searchValue ? (filterProducts.length > 0 ? (
                                filterProducts.map((product, index) => (
                                    <tr
                                        className="product__table-item"
                                        key={index}
                                    >
                                        <td className="product__table-item-id align-middle text-center">
                                            <Link className="link" to={`/products/detail/${product._id}`}>
                                                {product._id}
                                            </Link>
                                        </td>
                                        <td className="product__table-item-view align-middle text-center">
                                            <img src={product.image} alt="Product" />
                                            <span>{product.name}</span>
                                        </td>
                                        <td className="product__table-item-category align-middle text-center">{product.categoryId.name}</td>
                                        <td className="product__table-item-discount align-middle text-center">{product.discount}%</td>
                                        <td className="product__table-item-price align-middle text-center">
                                            <div className="product__table-item-price-wrapper">
                                                <span className="product__table-item-price-current">
                                                    <CurrencyFormat value={product.discount > 0 ? Math.round((product.price * (1 - product.discount / 1000)) / 1000) * 1000 : product.price} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                                                </span>
                                                {product.discount > 0 && (
                                                    <span className="product__table-item-price-old">
                                                        <CurrencyFormat value={product.price} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="product__table-item-control align-middle text-center">
                                            <Link className="link" to={`/products/detail/${product._id}`} title="Chi tiết">
                                                <i className="fa-solid fa-eye product__table-item-control-view"></i>
                                            </Link>
                                            <i className="fa-regular fa-trash-can product__table-item-control-delete" title="Xóa sản phẩm"
                                                onClick={() => handleDeleteProduct(product._id)}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">Không tìm thấy kết quả...</td>
                                </tr>
                            )) : (products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr
                                        className="product__table-item"
                                        key={index}
                                    >
                                        <td className="product__table-item-id align-middle text-center">
                                            <Link className="link" to={`/products/detail/${product._id}`}>
                                                {product._id}
                                            </Link>
                                        </td>
                                        <td className="product__table-item-view align-middle text-center">
                                            <img src={product.image} alt="Product" />
                                            <span>{product.name}</span>
                                        </td>
                                        <td className="product__table-item-category align-middle text-center">{product.categoryId.name}</td>
                                        <td className="product__table-item-discount align-middle text-center">{product.discount}%</td>
                                        <td className="product__table-item-price align-middle text-center">
                                            <div className="product__table-item-price-wrapper">
                                                <span className="product__table-item-price-current">
                                                    <CurrencyFormat value={product.discount > 0 ? Math.round((product.price * (1 - product.discount / 1000)) / 1000) * 1000 : product.price} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                                                </span>
                                                {product.discount > 0 && (
                                                    <span className="product__table-item-price-old">
                                                        <CurrencyFormat value={product.price} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="product__table-item-control align-middle text-center">
                                            <Link className="link" to={`/products/detail/${product._id}`} title="Chi tiết">
                                                <i className="fa-solid fa-eye product__table-item-control-view"></i>
                                            </Link>
                                            <i className="fa-regular fa-trash-can product__table-item-control-delete" title="Xóa sản phẩm"
                                                onClick={() => handleDeleteProduct(product._id)}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">Không tìm thấy kết quả...</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Delete */}
            <CustomModal
                title="Xóa màu"
                message="Bạn có thật sự muốn xóa sản phẩm này không?"
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                handleDelete={handleDelete}
            />

            {/* Modal Info Delete */}
            <CustomModal
                title={title}
                message={message}
                isOpenModal={error ? error : success}
                setIsOpenModal={handleCloseModal}
            />

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                maxPage={maxPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                handlePageEnter={handlePageEnter}
            />
        </div>
    )
}