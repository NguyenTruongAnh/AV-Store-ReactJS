import './password.css'
import './passwordResponsive.css'

import CustomModal from '../../components/customModal/CustomModal'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Password() {
    TabTitle('AV Admin - Đổi mật khẩu')

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isValidOldPassword, setIsValidOldPassword] = useState(true)
    const [isValidNewPassword, setIsValidNewPassword] = useState(true)
    const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true)
    const [isEqualPassword, setIsEqualPassword] = useState(true)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [message, setMessage] = useState("")
    const user = useSelector(state => state.user.currentUser)

    const handleEnterOldPassword = (e) => {
        if (!e.target.value && isValidOldPassword) {
            setIsValidOldPassword(false)
        } else if (e.target.value && !isValidOldPassword) {
            setIsValidOldPassword(true)
        }
    }

    const handleEnterNewPassword = (e) => {
        if (!e.target.value && isValidNewPassword) {
            setIsValidNewPassword(false)
        } else if (e.target.value && !isValidNewPassword) {
            setIsValidNewPassword(true)
        }
    }

    const handleEnterConfirmPassword = (e) => {
        if (!e.target.value && isValidConfirmPassword) {
            setIsValidConfirmPassword(false)
        } else if (e.target.value && !isValidConfirmPassword) {
            setIsValidConfirmPassword(true)
        }

        if (!isEqualPassword) {
            setIsEqualPassword(true)
        }
    }

    const handleSubmit = () => {
        if (!oldPassword) {
            setIsValidOldPassword(false)
        }

        if (!newPassword) {
            setIsValidNewPassword(false)
        }

        if (!confirmPassword) {
            setIsValidConfirmPassword(false)
        }

        if (oldPassword && newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                setIsEqualPassword(false)
            } else {
                handleChangePassword(oldPassword, newPassword, confirmPassword)
                setConfirmPassword('')
                setNewPassword('')
                setOldPassword('')
            }
        }
    }

    const handleChangePassword = async (password, newPassword, confirmPassword) => {
        const u = {
            password,
            newPassword, 
            confirmPassword
        }

        try {
            const res = await axios.put(`/users/password/${user.others._id}`, u, {
                headers: {
                    'Authorization': `Beaer ${user.accessToken}`
                }
            });
            const resData = res.data
            setMessage(resData.message)
            setIsOpenModal(true)
        } catch (err) {
            setMessage("Đã có lỗi xảy ra! Vui lòng thử lại.")
        }
    }

    const handleCloseModal = () => {
        setIsOpenModal(false);
    }

    return (
        <div className="password page">
            <h1 className="password__title page__title">Đổi mật khẩu</h1>
            <ul className="password__list">
                <li className="password__item">
                    <span className="password__item-title">Mật khẩu cũ</span>
                    <div className="password__item-wrapper">
                        <input
                            type="password"
                            className="password__item-input"
                            placeholder="Mật khẩu cũ"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            onKeyUp={(e) => handleEnterOldPassword(e)}
                        />
                        {!isValidOldPassword && (
                            <div className="password__item-invalid-feedback">
                                Vui lòng nhập mật khẩu cũ
                            </div>
                        )}
                    </div>
                </li>
                <li className="password__item">
                    <span className="password__item-title">Mật khẩu mới</span>
                    <div className="password__item-wrapper">
                        <input
                            type="password"
                            className="password__item-input"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onKeyUp={(e) => handleEnterNewPassword(e)}
                        />
                        {!isValidNewPassword && (
                            <div className="password__item-invalid-feedback">
                                Vui lòng nhập mật khẩu mới
                            </div>
                        )}
                    </div>
                </li>
                <li className="password__item">
                    <span className="password__item-title">Xác thực mật khẩu mới</span>
                    <div className="password__item-wrapper">
                        <input
                            type="password"
                            className="password__item-input"
                            placeholder="Xác thực mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyUp={(e) => handleEnterConfirmPassword(e)}
                        />
                        {!isValidConfirmPassword && (
                            <div className="password__item-invalid-feedback">
                                Vui lòng xác thực mật khẩu mới
                            </div>
                        )}
                        {!isEqualPassword && (
                            <div className="password__item-invalid-feedback">
                                Mật khẩu xác thực không chính xác
                            </div>
                        )}
                    </div>
                </li>
            </ul>
            <div className="d-flex justify-content-center">
                <button
                    className="password__confirm btn btn-danger"
                    onClick={() => handleSubmit()}
                >
                    Xác nhận
                </button>
            </div>

            {/* Modal */}
            <CustomModal
                title={"Thông báo"}
                message={message}
                isOpenModal={isOpenModal}
                setIsOpenModal={handleCloseModal}
            />
        </div>
    )
}
