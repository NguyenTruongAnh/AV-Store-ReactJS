import './register.css'
import './registerResponsive.css'

import { Link } from 'react-router-dom'
import { useState, useCallback} from 'react'
import axios from 'axios'

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleReset = () => {
        setName("")
        setEmail("")
        setPhone("")
        setPassword("")
        setConfirmPassword("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setSuccess("")
        if(name && email && validateEmail(email) && phone && password && confirmPassword) {
            try {
                const res = await axios.post("/auth/register", {
                    name,
                    email,
                    phone,
                    password,
                    confirmPassword,
                })
                
                if(res.data.code === 0) {
                    setSuccess(res.data.message)
                } else {
                    setError(res.data.message)
                }
                handleReset()
            } catch(err) {
                setError("Có lỗi! Vui lòng thử lại")
            }
        } else {
            setError("Vui lòng nhập đầy đủ thông tin")
        }
    }

    const handleKeyUpInput = (e, type) => {
        if(!e.target.value) {
            switch (type) {
                case 'name':
                    setError("Vui lòng nhập tên của bạn")
                    break
                case 'email':
                    setError("Vui lòng nhập địa chỉ email")
                    break
                case 'phone':
                    setError("Vui lòng nhập số điện thoại")
                    break
                case 'password':
                    setError("Vui lòng nhập mật khẩu")
                    break
                case 'confirmPassword':
                    setError("Vui lòng nhập xác thực mật khẩu")
                    break
                default:
            }
        } else {
            setError("")
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
        <div className="register">
            <div className="register-wrapper">
                <span className="register-title">Đăng ký</span>
                <form className="register-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="register-input"
                        placeholder="Tên của bạn"
                        value={name}
                        onKeyUp={(e) => handleKeyUpInput(e, 'name')}
                        onChange={e => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        className="register-input"
                        placeholder="Email của bạn"
                        value={email}
                        onKeyUp={(e) => handleKeyUpInput(e, 'email')}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        type="number"
                        className="register-input"
                        placeholder="SĐT của bạn"
                        value={phone}
                        onKeyUp={(e) => handleKeyUpInput(e, 'phone')}
                        onChange={e => setPhone(e.target.value)}
                    />

                    <input
                        type="password"
                        className="register-input"
                        placeholder="Mật khẩu"
                        value={password}
                        onKeyUp={(e) => handleKeyUpInput(e, 'password')}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        className="register-input"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onKeyUp={(e) => handleKeyUpInput(e, 'confirmPassword')}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    {error && <span style={{ color: 'red', marginTop: "10px" }}>{error}</span>}
                    {success && <span style={{ color: 'green', marginTop: "10px" }}>{success}</span>}
                    <button className="btn register-btn" type="submit">Đăng ký</button>
                </form>
            </div>
            <Link className="link  register-login-btn" to="/login">Login</Link>
        </div>
    )
}
