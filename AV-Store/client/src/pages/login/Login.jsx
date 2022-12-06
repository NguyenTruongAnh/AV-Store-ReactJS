import './login.css'
import './loginResponsive.css'

import { Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { login,loginGoogle } from "../../redux/apiCalls"
import { useDispatch, useSelector } from 'react-redux'

export default function Login() {
    const [email, setEmail] = useState()
    const [validEmail, setValidEmail] = useState(true)
    const [password, setPassword] = useState()
    const [validPassword, setValidPassword] = useState(true)
    const dispatch = useDispatch()
    const { isFetching, error } = useSelector((state) => state.user)

    const handleSubmit = () => {
        if (!email || !validateEmail(email)) {
            setValidEmail(false)
        }

        if (!password) {
            setValidPassword(false)
        }

        if (email && validateEmail(email) && password) {
            login(dispatch, { email, password })
        }
    }

    const handleGoogleAuth = () => {
        window.open("http://localhost:5000/api/auth/google/callback", "_self")
    }

    useEffect(() => {
        loginGoogle(dispatch)
    },[])

    const hanldeKeyUpInput = (e, type) => {
        if (type === 'email') {
            setValidEmail(!!e.target.value)
        }

        if (type === 'password') {
            setValidPassword(!!e.target.value)
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
        <div className="login">
            <div className="login-wrapper">
                <span className="login-title">Đăng nhập</span>
                <div className="login-form">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="login-input"
                        placeholder="Nhập email..."
                        onChange={e => setEmail(e.target.value)}
                        onKeyUp={(e) => hanldeKeyUpInput(e, 'email')}
                    />
                    {!validEmail && <div className="text-danger mt-1 ml-2">Vui lòng nhập email hợp lệ</div>}

                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Nhập mật khẩu..."
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={(e) => hanldeKeyUpInput(e, 'password')}
                    />
                    {!validPassword && <div className="text-danger mt-1 ml-2">Vui lòng nhập mật khẩu</div>}
                    {error && <div className="text-danger mt-1 ml-2">{error}</div> }
                    <button className="btn login-btn" disabled={isFetching} onClick={handleSubmit}>Đăng nhập</button>
                </div>

                <span className="login-divide"></span>
                <div 
                    className="login-google"
                    onClick={handleGoogleAuth}
                >
                    <div></div>
                    Sử dụng tài khoản Google
                </div>
                <div className="login-forgot login-forgot--password">
                    <span>Quên mật khẩu? </span> <Link to="/forgot-password">Cấp lại mật khẩu</Link>
                </div>
                <div className="login-forgot login-forgot--confirm">
                    <span>Cần mã xác thực mới? </span> <Link to="/resend-confirm">Gửi lại mã xác thực</Link>
                </div>
            </div>
            <Link className="link login-register-btn" to="/register">Đăng ký</Link>
        </div>
    )
}
