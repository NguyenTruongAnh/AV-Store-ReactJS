import './resendConfirm.css'
import './resendConfirmResponsive.css'

import { useState, useCallback } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function ForgotPassword() {
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [invalid, setInvalid] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = async () => {
        if (email && validateEmail(email)) {
            try {
                const res = await axios.post('/auth/resend-verify', { email });
                setModalMessage(res.data.message);
            } catch (err) {
                setModalMessage("Có lỗi xảy ra! Vui lòng thử lại")
            }
            setShowModal(true)
        } else {
            setInvalid(true)
        }
    }

    const handleKeyUpInput = (e) => {
        if (!e.target.value) {
            setInvalid(true)
        } else {
            setInvalid(false)
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
        <div className="resend-confirm">
            <div className="resend-confirm-wrapper">
                <span className="resend-confirm-title">Gửi lại mã xác thực</span>
                <div className="resend-confirm-form">
                    <input
                        type="email"
                        className="resend-confirm-input"
                        placeholder="Nhập địa chỉ email"
                        autoComplete="off"
                        value={email}
                        onKeyUp={(e) => handleKeyUpInput(e)}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {invalid && <span class="mt-2 ml-2 text-danger">Vui lòng nhập địa chỉ email</span>}
                    <button 
                        className="btn resend-confirm-btn"
                        onClick={handleSubmit}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Gửi lại mã xác thực</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Link className="link  resend-confirm-login-btn" to="/login">Login</Link>
        </div>
    )
}
