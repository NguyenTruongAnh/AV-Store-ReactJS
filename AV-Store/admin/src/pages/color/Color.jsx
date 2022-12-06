import './color.css'
import './colorResponsive.css'

import { SketchPicker } from 'react-color'
import { useState, useEffect, useRef } from 'react'
import CustomModal from '../../components/customModal/CustomModal'
import Loading from '../../components/loading/Loading'
import { clear } from '../../redux/colorRedux'
import { useDispatch, useSelector } from "react-redux"
import { getColors, createColor, editColor, deleteColor } from "../../redux/colorApiCalls"
import { TabTitle } from '../../utils/GeneralFunction'

export default function Color() {
    TabTitle('AV Admin - Màu sắc')

    // Chứa giá trị cho color picker
    const [pickerColor, setPickerColor] = useState('#bd0e17')
    // Đóng mở color picker
    const [isOpenColorPicker, setIsOpenColorPicker] = useState(false)
    // Chứa giá trị màu dạng hex
    const [hexColor, setHexColor] = useState('')
    // Tên màu
    const [colorName, setColorName] = useState('')
    // Chứa id của màu được chọn để edit (hiện đang dùng tạm index)
    const [editColorId, setEditColorId] = useState(-1)
    // Chế độ: thêm mới hoặc edit
    const [mode, setMode] = useState('')
    // Chứa giá trị search màu
    const [inputSearch, setInputSearch] = useState('')
    // Chứa element color picker, dùng để bắt sự kiện click outsite
    const colorPicker = useRef(null)
    // Đóng mở modal xóa
    const [isOpenModal, setIsOpenModal] = useState(false)
    // Chứa id của màu được chọn để xóa
    const [deleteColorId, setDeleteColorId] = useState('')
    // Chứa mảng màu đã được filter
    const [filterColors, setFilterColors] = useState([])
    // Loading
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()
    const { isFetching, error, success, message, title } = useSelector((state) => state.color)
    const colors = useSelector((state) => state.color.colors)

    useEffect(() => {
        if (isFetching) {
            setIsLoading(true)
        } else {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [isFetching])

    useEffect(() => {
        const handleClickOutsitePicker = function (event) {
            if (!colorPicker.current.contains(event.target)
                && !event.target.classList.contains('color__form-item-color-view')
                && isOpenColorPicker) {
                setIsOpenColorPicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutsitePicker)

        return () => {
            document.removeEventListener('mousedown', handleClickOutsitePicker)
        }
    })

    const handleChangeColor = (color) => {
        setPickerColor(color)
    }

    const handleChangeCompleteColor = (color) => {
        setHexColor(color.hex)
    }

    const handleInputSearch = () => {
        const value = inputSearch.toLowerCase().trim()
        if (value) {
            setFilterColors(colors.filter(
                (c) => c.name.toLowerCase().indexOf(value) > -1 || c.hex.toLowerCase().indexOf(value) > -1
            ))
        } else {
            setFilterColors([])
        }
    }

    const handleEdit = (colorId) => {
        const editColor = colors.filter(color => color._id === colorId)[0]
        setColorName(editColor.name)
        setHexColor(editColor.hex)
        setPickerColor(editColor.hex)
        setEditColorId(colorId)
        setMode('edit')
    }

    const handleUpdate = () => {
        if (colorName && hexColor) {
            editColor(dispatch, { name: colorName, hex: hexColor }, editColorId)
            handleReset()
        }
    }

    const handleSubmit = () => {
        const color = { name: colorName, hex: hexColor }
        createColor(dispatch, color)
        handleReset()
    }

    const handleReset = () => {
        setColorName('')
        setHexColor('')
        setPickerColor('')
        setEditColorId('')
        setMode('')
    }

    const handleSelectDelete = (id) => {
        setDeleteColorId(id)
        setIsOpenModal(true)
    }

    const handleDelete = () => {
        deleteColor(dispatch, deleteColorId)
        setDeleteColorId('')
        setIsOpenModal(false)
    }

    const handleCloseModal = () => {
        dispatch(clear())
    }

    useEffect(() => {
        getColors(dispatch)
    }, [dispatch])

    return (
        <div className="color page">
            <h1 className="color__title page__title">Danh sách màu</h1>
            <div className="color__content">
                <div className="container-fruid">
                    <div className="row">
                        {/* Left */}
                        <div className="col-12 col-md-4 col-lg-3">
                            <div className="color__form row">
                                <div className="color__form-item col-12">
                                    <span>Tên màu</span>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên màu"
                                        value={colorName}
                                        onChange={(e) => setColorName(e.target.value)}
                                    />
                                </div>
                                <div className="color__form-item col-12">
                                    <span>Chọn màu</span>
                                    <div className="color__form-item-color">
                                        <span
                                            style={{ backgroundColor: hexColor }}
                                            className="color__form-item-color-view"
                                            onClick={() => setIsOpenColorPicker(!isOpenColorPicker)}
                                        ></span>
                                        <div
                                            ref={colorPicker}
                                            id="color__picker"
                                            className={isOpenColorPicker ? "color__picker active" : "color__picker"}
                                        >
                                            <SketchPicker
                                                color={pickerColor}
                                                onChange={(color) => handleChangeColor(color)}
                                                onChangeComplete={(color) => handleChangeCompleteColor(color)}
                                            />
                                        </div>
                                        <b>{hexColor}</b>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center col-12 mt-4">
                                    {mode !== 'edit' ? (
                                        hexColor && colorName ? (
                                            <button type="button" className="btn color__form-btn color__form-confirm" onClick={() => handleSubmit()} disabled={isFetching}>Xác nhận</button>
                                        ) : (
                                            <button type="button" className="btn color__form-btn color__form-confirm disabled">Xác nhận</button>
                                        )
                                    ) : (
                                        <button type="button" className="btn color__form-btn color__form-update" onClick={() => handleUpdate()} disabled={isFetching}>Cập nhật</button>
                                    )}
                                    <button type="button" className="btn color__form-btn color__form-reset" onClick={() => handleReset()}>Reset</button>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="col-12 col-md-8 col-lg-8 offset-lg-1">
                            <div className="color__search">
                                <div className="color__search-wrapper">
                                    <input
                                        type="text"
                                        className="color__search-input"
                                        placeholder="Nhập tên hoặc mã của màu..."
                                        value={inputSearch}
                                        onChange={(e) => setInputSearch(e.target.value)}
                                        onKeyUp={() => handleInputSearch()}
                                    />
                                    <i className="color__search-btn fa-solid fa-magnifying-glass"></i>
                                </div>
                            </div>
                            <div className="color__list-wrapper">
                                {isLoading ? (
                                    <div className="d-flex justify-content-center">
                                        <Loading />
                                    </div>
                                ) : (
                                    <ul className="color__list">
                                        {inputSearch ? (filterColors.length > 0 ? (filterColors.map((color, index) => (
                                            <li
                                                key={index}
                                                className={color._id === editColorId ? "color__item edit" : "color__item"}
                                                style={{ borderColor: (color.hex === '#fff' || color.hex === '#ffffff') ? '#dfdfdf' : color.hex }}
                                            >
                                                <div
                                                    className="color__item-info"
                                                    title={color.hex}
                                                    onClick={() => handleEdit(color._id)}
                                                >
                                                    <span style={{ backgroundColor: color.hex }}></span>
                                                    <span>{color.name}</span>
                                                </div>
                                                <div className="color__item-control">
                                                    <i
                                                        className="color__item-control-delete fa-solid fa-xmark"
                                                        onClick={() => handleSelectDelete(color._id)}
                                                    ></i>
                                                </div>
                                            </li>
                                        ))) : (<li className="text-center">Không tìm thấy kết quả...</li>))
                                            : (colors.length > 0 ? (colors.map((color, index) => (
                                                <li
                                                    key={index}
                                                    className={color._id === editColorId ? "color__item edit" : "color__item"}
                                                    style={{ borderColor: (color.hex === '#fff' || color.hex === '#ffffff') ? '#dfdfdf' : color.hex }}
                                                >
                                                    <div
                                                        className="color__item-info"
                                                        title={color.hex}
                                                        onClick={() => handleEdit(color._id)}
                                                    >
                                                        <span style={{ backgroundColor: color.hex }}></span>
                                                        <span>{color.name}</span>
                                                    </div>
                                                    <div className="color__item-control">
                                                        <i
                                                            className="color__item-control-delete fa-solid fa-xmark"
                                                            onClick={() => handleSelectDelete(color._id)}
                                                        ></i>
                                                    </div>
                                                </li>
                                            ))) : (<li className="text-center">Không tìm thấy màu nào...</li>))}
                                    </ul>
                                )}

                                {/* Modal Delete */}
                                <CustomModal
                                    title="Xóa màu"
                                    message="Bạn có thật sự muốn xóa màu này không?"
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
        </div>
    )
}
