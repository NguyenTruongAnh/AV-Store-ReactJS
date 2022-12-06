import './account.css'
import './accountResponsive.css'

import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Pagination from '../../components/pagination/Pagination'
import Loading from '../../components/loading/Loading'
import axios from "axios"
import { TabTitle } from '../../utils/GeneralFunction'

export default function Account() {
    TabTitle('AV Admin - Tài khoản')
    
    const [accounts, setAccounts] = useState([])

    const [searchValue, setSearchValue] = useState('')

    const [isLoading, setIsLoading] = useState(true)

    const location = useLocation()
    const navigate = useNavigate()
    let params = new URLSearchParams(location.search)
    const [currentPage, setCurrentPage] = useState({
        page: 1,
    })
    const [maxPage, setMaxPage] = useState(0)

    useEffect(() => {
        const getMaxPage = async () => {
            try {
                const res = await axios.get(`/users/page`)
                setMaxPage(res.data)
            } catch (err) { }
        }

        getMaxPage()
    }, [])

    useEffect(() => {
        if (isNaN(params.get('page'))) {
            navigate(`/accounts?page=${1}`)
        } else {
            const page = params.get('page') && params.get('page') !== "0" ? parseInt(params.get('page')) : 1

            const getAccounts = async (page) => {
                try {
                    const res = await axios.get(`/users?page=${page}`)
                    setAccounts(res.data)
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
                } catch (err) { }
            }

            setIsLoading(true)
            getAccounts(page)
        }
    }, [params.get('page')])

    // Xử lý search
    const handleSearchInput = (e) => {
        if (!isNaN(e.target.value)) {
            setSearchValue(e.target.value)
        }
    }

    const handleSearchEnter = (keyCode) => {
        if (keyCode === 13) {
            console.log(`Search kết quả ${searchValue}`)
        }
    }

    // Xử lý Page
    const handlePreviousPage = () => {
        if (currentPage.page > maxPage) {
            navigate(`/accounts?page=${maxPage}`)
        } else {
            navigate(`/accounts?page=${currentPage.page - 1}`)
        }
    }

    const handleNextPage = () => {
        if (currentPage.page < 1) {
            navigate(`/accounts?page=${1}`)
        } else {
            navigate(`/accounts?page=${currentPage.page + 1}`)
        }
    }

    const handlePageEnter = (e) => {
        if (e.keyCode === 13 && currentPage.page) {
            navigate(`/accounts?page=${currentPage.page}`)
        }
    }

    return (
        <div className="account page">
            <h1 className="account__title page__title">Danh sách tài khoản</h1>
            <div className="account__control">
                <div className="account__search">
                    <div className="account__search-wrapper">
                        <input
                            className="account__search-input"
                            type="text"
                            placeholder="Nhập số điện thoại..."
                            value={searchValue}
                            onChange={(e) => handleSearchInput(e)}
                            onKeyUp={(e) => handleSearchEnter(e.keyCode)}
                        />
                        <i
                            className="account__search-btn fa-solid fa-magnifying-glass"
                            onClick={() => handleSearchEnter(13)}
                        ></i>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table account__table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Ngày tạo</th>
                            <th scope="col" style={{ minWidth: 140 }}>Số điện thoại</th>
                            <th scope="col" style={{ minWidth: 180 }}>Email</th>
                            <th scope="col" style={{ minWidth: 120 }}>Thao tác</th>
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
                            accounts.length > 0 ? (
                                accounts.map((account, index) => (
                                    <tr
                                        key={index}
                                        className="account__table-item"
                                    >
                                        <th
                                            scope="row"
                                            className="account__table-item-id align-middle"
                                        >
                                            <Link className="link" to={`/accounts/detail/${account._id}`}>
                                                {account._id}
                                            </Link>
                                        </th>
                                        <td className="account__table-item-date align-middle">
                                            {new Date(account.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="account__table-item-phone align-middle">
                                            {account.phone}
                                        </td>
                                        <td className="account__table-item-email align-middle">
                                            {account.email}
                                        </td>
                                        <td className="account__table-item-control align-middle">
                                            <Link className="link" to={`/accounts/detail/${account._id}`} title="Chi tiết">
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
