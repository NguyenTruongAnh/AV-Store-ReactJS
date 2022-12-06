import './forgotPassword.css'
import './forgotPasswordResponsive.css'

import { useState, useCallback } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function ForgotPassword() {
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    const [canEditEmail, setCanEditEmail] = useState(true)
    const [validEmail, setValidEmail] = useState(true)
    const [email, setEmail] = useState('')

    const [validOtp, setValidOtp] = useState(true)
    const [otp, setOtp] = useState('')

    const [validPassword, setValidPassword] = useState(true)
    const [password, setPassword] = useState('')

    const [validConfirmPassword, setValidConfirmPassword] = useState(true)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('')

    const handleSubmitEmail = async () => {
        if (email && validateEmail(email)) {
            // if (email === 'truonganhvnbd@gmail.com') {
            //     setModalMessage('Vui lòng xử dụng mã OTP vừa được gửi vào email của bạn để tiến hành đổi mật khẩu.')
            //     setCanEditEmail(false)
            // } else {
            //     setModalMessage('Địa chỉ email không chính xác hoặc không tồn tại.')
            // }

            try {
                const res = await axios.post('/auth/otp', { email });
                if(res.data.code === 0) {
                    setModalMessage(res.data.message);
                    setCanEditEmail(false)
                } else {
                    setModalMessage(res.data.message);
                }
            } catch (err) {
                setModalMessage("Có lỗi xảy ra! Vui lòng thử lại")
            }
            setShowModal(true)
        } else {
            setValidEmail(false)
        }
    }

    const handleSubmitPassword = async () => {
        setValidOtp(!!otp)
        setValidPassword(!!password)
        setValidConfirmPassword(!!confirmPassword)

        if (otp && password && confirmPassword) {
            if (password === confirmPassword) {
                try {
                    const res = await axios.post('/auth/forgot-password', { otp, email, password, confirmPassword });
                    setModalMessage(res.data.message);
                } catch (err) {
                    setModalMessage("Có lỗi xảy ra! Vui lòng thử lại")
                }
                setCanEditEmail(true)
                setShowModal(true)
            } else {
                setConfirmPasswordMessage('Mật khẩu xác thực không chính xác')
            }
        }
    }

    const handleKeyUpInput = (e, type) => {
        switch (type) {
            case 'email':
                setValidEmail(!!e.target.value)
                break
            case 'otp':
                setValidOtp(!!e.target.value)
                break
            case 'password':
                setValidPassword(!!e.target.value)
                break
            case 'confirmPassword':
                setValidConfirmPassword(!!e.target.value)
                setConfirmPasswordMessage('')
                break
            default:
        }
    }

    const validateEmail = useCallback((email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }, [])

    return (
        <div className="forgot-password">
            <div className="forgot-password-wrapper">
                <span className="forgot-password-title">Cấp lại mật khẩu</span>
                <div className="forgot-password-form">
                    <div className="forgot-password-group">
                        <input
                            type="email"
                            className="forgot-password-input"
                            placeholder="Nhập địa chỉ email"
                            disabled={canEditEmail ? '' : 'disabled'}
                            value={email}
                            onKeyUp={(e) => handleKeyUpInput(e, 'email')}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {!validEmail && <p className="mt-2 mx-2 mb-0 text-danger">Vui lòng nhập địa chỉ email</p>}
                    </div>

                    {canEditEmail ? (
                        <button
                            className="btn forgot-password-btn"
                            onClick={handleSubmitEmail}
                        >
                            Xác nhận
                        </button>
                    ) : (
                        <>
                            <div className="forgot-password-group">
                                <input
                                    type="text"
                                    className="forgot-password-input"
                                    placeholder="Nhập mã OTP"
                                    value={otp}
                                    onKeyUp={(e) => handleKeyUpInput(e, 'otp')}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                {!validOtp && <p className="mt-2 mx-2 mb-0 text-danger">Vui lòng nhập mã OTP</p>}
                            </div>

                            <div className="forgot-password-group">
                                <input
                                    type="password"
                                    className="forgot-password-input"
                                    placeholder="Nhập mật khẩu mới"
                                    value={password}
                                    onKeyUp={(e) => handleKeyUpInput(e, 'password')}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {!validPassword && <p className="mt-2 mx-2 mb-0 text-danger">Vui lòng nhập mật khẩu mới</p>}
                            </div>

                            <div className="forgot-password-group">
                                <input
                                    type="password"
                                    className="forgot-password-input"
                                    placeholder="Xác thực mật khẩu mới"
                                    value={confirmPassword}
                                    onKeyUp={(e) => handleKeyUpInput(e, 'confirmPassword')}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {!validConfirmPassword && <p className="mt-2 mx-2 mb-0 text-danger">Vui lòng xác thực mật khẩu mới</p>}
                                {confirmPasswordMessage && <p className="mt-2 mx-2 mb-0 text-danger">{confirmPasswordMessage}</p>}
                            </div>

                            <button
                                className="btn forgot-password-btn"
                                onClick={handleSubmitPassword}
                            >
                                Xác nhận
                            </button>
                        </>
                    )}
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Cấp lại mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowModal(false)}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

            <Link className="link  forgot-password-login-btn" to="/login">Login</Link>
        </div>
    )
}
