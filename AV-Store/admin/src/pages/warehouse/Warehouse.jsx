import './warehouse.css'
import './warehouseResponsive.css'

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../../components/pagination/Pagination'
import CustomSelection from '../../components/customSelection/CustomSelection'
import CurrencyFormat from 'react-currency-format'
import { getCategories } from "../../redux/categoryApiCalls"
import { tokenExpires } from "../../redux/userRedux"
import CustomModal from '../../components/customModal/CustomModal'
import Loading from '../../components/loading/Loading'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Warehouse() {
    TabTitle('AV Admin - Kho')

    const dispatch = useDispatch()
    const categories = useSelector((state) => state.category.categories)
    const options = ["Tất cả"].concat(categories.map((category) => category.name))
    const accessToken = useSelector((state) => state.user.currentUser.accessToken)
    const [samples, setSamples] = useState([])
    const [isOpenSelection, setIsOpenSelection] = useState(false)
    const [selectionValue, setSelectionValue] = useState("Tất cả")
    const [searchValue, setSearchValue] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    // Chứa thông tin sản phẩm đang được edit
    const [editSample, setEditSample] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    let params = new URLSearchParams(location.search)
    const [currentPage, setCurrentPage] = useState({
        page: 1,
    })
    const [maxPage, setMaxPage] = useState(1)
    const [message, setMessage] = useState("")
    const [isOpenModal, setIsOpenModal] = useState(false)

    const handleSelection = (value) => {
        if (value !== selectionValue) {
            setSelectionValue(value)
        }
        setIsOpenSelection(false)
    }

    const handleCancel = () => {
        setEditSample(null)
    }

    const handleConfirm = () => {
        const updateSample = async (quantity, id) => {
            try {

                const res = await axios.put(`/warehouse/${id}`, { quantity }, {
                    headers: {
                        Authorization: `Beaer ${accessToken}`,
                    },
                })
                const resData = res.data
                if (resData.code === 0) {
                    setSamples((prev) => {
                        return prev.map(sample => {
                            if (sample._id === editSample._id && sample.colorId.hex === editSample.colorId.hex) {
                                return editSample
                            }
                            return sample
                        })
                    })
                    setEditSample(null)
                    setMessage(resData.message)
                    setIsOpenModal(true)
                } else if (resData.code === 2) {
                    dispatch(tokenExpires())
                } else {
                    setMessage(resData.message)
                    setIsOpenModal(true)
                }
            } catch (err) { }
        }

        updateSample(editSample.quantity, editSample._id)
    }

    const handleSearchEnter = (keyCode) => {
        // Enter
        if (keyCode === 13) {
            if (searchValue.trim().length > 0) {
                setSamples(() => {
                    const newProducts = [].filter((sample) => sample.id.toString() === searchValue.toString().toLowerCase().trim())
                    return newProducts
                })
            } else {
                setSamples([])
            }
        }
    }

    // Xử lý Page
    const handlePreviousPage = () => {
        if (currentPage.page > maxPage) {
            navigate(`/warehouse?page=${maxPage}`)
        } else {
            navigate(`/warehouse?page=${currentPage.page - 1}`)
        }
    }

    const handleNextPage = () => {
        if (currentPage.page < 1) {
            navigate(`/warehouse?page=${1}`)
        } else {
            navigate(`/warehouse?page=${currentPage.page + 1}`)
        }
    }

    const handlePageEnter = (e) => {
        if (e.keyCode === 13 && currentPage.page) {
            navigate(`/warehouse?page=${currentPage.page}`)
        }
    }

    useEffect(() => {
        const getMaxPage = async () => {
            try {
                const res = await axios.get(`/warehouse/page`)
                setMaxPage(res.data)
            } catch (err) { }
        }

        getCategories(dispatch)
        getMaxPage()
    }, [])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })

        if (isNaN(params.get('page'))) {
            navigate(`/warehouse?page=${1}`)
        } else {
            const page = params.get('page') && params.get('page') !== "0" ? parseInt(params.get('page')) : 1
            setCurrentPage({
                page
            })
            const getSamples = async (page) => {
                try {
                    const res = await axios.get(`/warehouse?page=${page}`)
                    setSamples(res.data)
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
                } catch (err) { }
            }

            setIsLoading(true)
            getSamples(page)
        }
    }, [params.get('page')])

    return (
        <div className="warehouse page">
            <h1 className="warehouse__title page__title">Danh sách số lượng</h1>
            <div className="warehouse__control">
                <div className="warehouse__filter">
                    <h4 className="warehouse__filter-title">Danh mục:</h4>
                    <CustomSelection
                        options={options}
                        isOpenSelection={isOpenSelection}
                        setIsOpenSelection={setIsOpenSelection}
                        selectionValue={selectionValue}
                        handleSelection={handleSelection}
                    />
                </div>
                <div className="warehouse__search">
                    <div className="warehouse__search-wrapper">
                        <input
                            className="warehouse__search-input"
                            type="text"
                            placeholder="Nhập mã sản phẩm..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyUp={(e) => handleSearchEnter(e.keyCode)}
                        />
                        <i
                            className="warehouse__search-btn fa-solid fa-magnifying-glass"
                            onClick={() => handleSearchEnter(13)}
                        ></i>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table warehouse__table">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">ID</th>
                            <th scope="col" className="text-left" style={{ width: 500, }}>Sản phẩm</th>
                            <th scope="col" className="text-center">Phân loại</th>
                            <th scope="col" className="text-center">Màu sắc</th>
                            <th scope="col" className="text-center">Số lượng tồn kho</th>
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
                            samples.length > 0 ? (
                                samples.map((sample, index) => (
                                    <tr
                                        key={index}
                                        className="warehouse__table-item"
                                    >
                                        <td className="warehouse__table-item-id align-middle text-center">
                                            {sample._id}
                                        </td>
                                        <td className="warehouse__table-item-view align-middle text-center">
                                            <img src={sample.image} />
                                            <span>{sample.productId.name}</span>
                                        </td>
                                        <td className="warehouse__table-item-category align-middle text-center">{categories.find(c => c._id === sample.productId.categoryId).name}</td>
                                        <td className="warehouse__table-item-color align-middle text-center">
                                            <span style={{ backgroundColor: sample.colorId.hex }}></span>
                                            <p>{sample.colorId.name}</p>
                                        </td>
                                        <td className="warehouse__table-item-amount align-middle text-center">
                                            <ul>
                                                {sample.quantity.map((p, index) => {
                                                    let key = Object.keys(p)[0]
                                                    return (
                                                        <li key={index}>
                                                            <span>{key}</span>
                                                            {editSample
                                                                && editSample._id === sample._id
                                                                && editSample.colorId.hex === sample.colorId.hex ? (
                                                                <CurrencyFormat
                                                                    value={editSample.quantity[index][key]}
                                                                    thousandSeparator={true}
                                                                    placeholder="Số lượng"
                                                                    displayType="input"
                                                                    onValueChange={(values) => {
                                                                        const { value } = values
                                                                        setEditSample((prev) => {
                                                                            const newEditSample = JSON.parse(JSON.stringify(prev))
                                                                            if (value) {
                                                                                newEditSample.quantity[index][key] = Math.abs(parseInt(value))
                                                                            } else {
                                                                                newEditSample.quantity[index][key] = 0
                                                                            }
                                                                            return newEditSample
                                                                        })
                                                                    }}
                                                                />
                                                            ) : (
                                                                <CurrencyFormat
                                                                    value={p[key]}
                                                                    thousandSeparator={true}
                                                                    placeholder="Số lượng"
                                                                    displayType="text"
                                                                />
                                                            )}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </td>
                                        <td className="warehouse__table-item-control align-middle text-center">
                                            {editSample && editSample._id === sample._id && editSample.colorId.hex === sample.colorId.hex ? (
                                                <>
                                                    <div
                                                        className="warehouse__table-item-control-confirm"
                                                        title="Xác nhận"
                                                        onClick={() => handleConfirm()}
                                                    >
                                                        <i className="fa-regular fa-circle-check"></i>
                                                    </div>
                                                    <div
                                                        className="warehouse__table-item-control-cancel"
                                                        title="Hủy bỏ"
                                                        onClick={() => handleCancel()}
                                                    >
                                                        <i className="fa-regular fa-circle-xmark"></i>
                                                    </div>
                                                </>
                                            ) : (
                                                <div
                                                    className="warehouse__table-item-control-update"
                                                    title="Cập nhật"
                                                    onClick={() => setEditSample(JSON.parse(JSON.stringify(sample)))}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">Không tìm thấy kết quả...</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Info Update */}
            <CustomModal
                title="Chỉnh sửa số lượng trong kho"
                message={message}
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
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