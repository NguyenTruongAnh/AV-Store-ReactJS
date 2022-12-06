import './order.css'
import './orderResponsive.css'

import Pagination from '../../components/pagination/Pagination'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import CustomSelection from '../../components/customSelection/CustomSelection'
import Loading from '../../components/loading/Loading'
import CurrencyFormat from 'react-currency-format'
import axios from "axios"
import { TabTitle } from '../../utils/GeneralFunction'

export default function Order() {
    TabTitle('AV Admin - Đơn hàng')

    const location = useLocation()
    const navigate = useNavigate()
    let params = new URLSearchParams(location.search)
    const [currentPage, setCurrentPage] = useState({
        page: 1,
    })
    const [orders, setOrders] = useState([])

    const [isOpenSelection, setIsOpenSelection] = useState(false)
    const [selectionValue, setSelectionValue] = useState("Tất cả")

    const [searchValue, setSearchValue] = useState('')
    const [maxPage, setMaxPage] = useState(0)

    const [isLoading, setIsLoading] = useState(true)

    // Xử lý selection
    const handleSelection = (value) => {
        if (value !== selectionValue) {
            setSelectionValue(value)
        }
        setIsOpenSelection(false)
    }

    // Xử lý search
    const handleSearchEnter = (keyCode) => {
        if (keyCode === 13) {
            console.log(`Search kết quả ${searchValue}`)
        }
    }

    // Xử lý Page
    const handlePreviousPage = () => {
        if (currentPage.page > maxPage) {
            navigate(`/orders?page=${maxPage}`)
        } else {
            navigate(`/orders?page=${currentPage.page - 1}`)
        }
    }

    const handleNextPage = () => {
        if (currentPage.page < 1) {
            navigate(`/orders?page=${1}`)
        } else {
            navigate(`/orders?page=${currentPage.page + 1}`)
        }
    }

    const handlePageEnter = (e) => {
        if (e.keyCode === 13 && currentPage.page) {
            navigate(`/orders?page=${currentPage.page}`)
        }
    }

    const getOrders = async (page) => {
        try {
            let url = "/orders"
            if (page) {
                url += `?page=${page}`
            }
            const res = await axios.get(url)
            setOrders(res.data)
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        } catch (err) { }
    }

    useEffect(() => {
        if (isNaN(params.get('page'))) {
            navigate(`/orders?page=${1}`)
        } else {
            const page = params.get('page') && params.get('page') !== "0" ? parseInt(params.get('page')) : 1
            setCurrentPage({
                page
            })

            setIsLoading(true)
            getOrders(page)
        }
    }, [params.get('page')])

    useEffect(() => {
        const getMaxPage = async () => {
            try {
                const res = await axios.get("/orders/page")
                setMaxPage(res.data)
            } catch (err) { }
        }

        getMaxPage()
    }, [])

    return (
        <div className="order page">
            <h1 className="order__title page__title">Danh sách đơn hàng</h1>
            <div className="order__control">
                <div className="order__filter">
                    <h4 className="order__filter-title">Danh mục:</h4>
                    <CustomSelection
                        options={["Tất cả", "Chờ duyệt", "Chờ lấy hàng", "Đang giao", "Đã giao", "Hủy đơn", "Trả hàng"]}
                        isOpenSelection={isOpenSelection}
                        setIsOpenSelection={setIsOpenSelection}
                        selectionValue={selectionValue}
                        handleSelection={handleSelection}
                    />
                </div>

                <div className="order__search">
                    <div className="order__search-wrapper">
                        <input
                            className="order__search-input"
                            type="text"
                            placeholder="Nhập mã đơn hàng..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyUp={(e) => handleSearchEnter(e.keyCode)}
                        />
                        <i
                            className="order__search-btn fa-solid fa-magnifying-glass"
                            onClick={() => handleSearchEnter(13)}
                        ></i>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table order__table">
                    <thead>
                        <tr>
                            <th scope="col" >ID</th>
                            <th scope="col" >Ngày đặt</th>
                            <th scope="col" style={{ minWidth: "120px" }}>Tình trạng</th>
                            <th scope="col" style={{ minWidth: "180px" }}>Tổng tiền</th>
                            <th scope="col" >Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5">
                                    <div className="d-flex justify-content-center">
                                        <Loading />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr
                                        key={index}
                                        className="order__table-item"
                                    >
                                        <td className="order__table-item-id align-middle">
                                            <Link className="link" to={`/orders/detail/${order._id}`}>
                                                {order._id}
                                            </Link>
                                        </td>
                                        <td className="order__table-item-date align-middle">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                                        <td className={`order__table-item-status align-middle ${order.status}`}>
                                            {
                                                {
                                                    "wait-confirm": "Chờ duyệt",
                                                    "wait-picking": "Chờ lấy hàng",
                                                    "picked": "Giao hàng",
                                                    "shipping": "Đang giao",
                                                    "complete": "Đã giao",
                                                    "cancel": "Hủy",
                                                    "return": "Trả hàng"
                                                }[order.status]
                                            }
                                        </td>
                                        <td className="order__table-item-price align-middle">
                                            <CurrencyFormat
                                                value={order.amount}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' đ'}
                                            />
                                        </td>
                                        <td className="order__table-item-control align-middle">
                                            <Link className="link" to={`/orders/detail/${order._id}`} title="Chi tiết">
                                                <i className="fa-solid fa-eye"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="order__table-item">
                                    <td colSpan="5" className="text-center">Không tìm thấy kết quả...</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

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