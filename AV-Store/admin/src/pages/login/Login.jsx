import './login.css'
import './loginResponsive.css'
import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/authApiCalls'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Login() {
    TabTitle('AV Admin - Đăng nhập')

    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(true)
    const [password, setPassword] = useState("")
    const [validPassword, setValidPassword] = useState(true)
    const dispatch = useDispatch()
    const { isFetching, error } = useSelector((state) => state.user)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        setErrorMessage(error)
    }, [error])

    const handleClick = (e) => {
        e.preventDefault()
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

    const hanldeKeyUpInput = (e, type) => {
        if (type === 'email') {
            setValidEmail(!!e.target.value)
        }

        if (type === 'password') {
            setValidPassword(!!e.target.value)
        }

        setErrorMessage("")
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
                <form className="login-form">
                    <label>Email:</label>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Nhập email..."
                        onChange={e=>setEmail(e.target.value)}
                        onKeyUp={(e) => hanldeKeyUpInput(e, 'email')}
                    />
                    {!validEmail && <div className="text-danger mt-1 ml-2">Vui lòng nhập email hợp lệ</div>}

                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Nhập mật khẩu..."
                        onChange={e=>setPassword(e.target.value)}
                        onKeyUp={(e) => hanldeKeyUpInput(e, 'password')}
                    />
                    {!validPassword && <div className="text-danger mt-1 ml-2">Vui lòng nhập mật khẩu</div>}
                    {errorMessage && <div className="text-danger mt-1 ml-2">{errorMessage}</div>}
                    <button onClick={handleClick} disabled={isFetching}
                    className="btn login-btn">Đăng nhập</button>
                </form>
            </div>
        </div>
    )
}
