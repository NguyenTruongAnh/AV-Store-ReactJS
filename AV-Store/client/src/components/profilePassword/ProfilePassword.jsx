import './profilePassword.css'
import './profilePasswordResponsive.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios'

export default function ProfilePassword() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const user = useSelector(state => state.user.currentUser)
    const handleChangePassword = async () => {
        if(password, newPassword, confirmPassword) {
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
                if(resData.code === 0) {
                    setSuccess(resData.message);
                } else {
                    setError(resData.message);
                }
            } catch (err) {
                setError("Có lỗi xảy ra! Vui lòng thử lại")
            }
        } else {
            setError("Vui lòng nhập đầy đủ các trường!")
        }
    }

    useEffect(() => {
        if(success) {
            setSuccess(success)
            setError(false)
            setTimeout(() => {
                setSuccess(false)
            }, 5000)
        }
    }, [success])

    useEffect(() => {
        if(error) {
            setError(error)
            setSuccess(false)
            setTimeout(() => {
                setError(false)
            }, 5000)
        }
    }, [error])
    return (
        <div className="profile-password">
            <h2 className="profile-password__title">Đổi mật khẩu</h2>
            <ul className="profile-password__list">
                <li className="profile-password__item">
                    <span className="profile-password__item-title">Mật khẩu cũ</span>
                    <input type="password" className="profile-password__item-input" 
                        placeholder="Mật khẩu cũ" 
                        onChange={(e) => setPassword(e.target.value)}    
                    />
                </li>
                <li className="profile-password__item">
                    <span className="profile-password__item-title">Mật khẩu mới</span>
                    <input type="password" className="profile-password__item-input" 
                        placeholder="Mật khẩu mới" 
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </li>
                <li className="profile-password__item">
                    <span className="profile-password__item-title">Xác nhận mật khẩu mới</span>
                    <input type="password" className="profile-password__item-input" 
                        placeholder="Xác thực mật khẩu mới" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </li>
            </ul>
            { error && <div className="text-danger text-center mb-2">{error}</div> }
            { success && <div className="text-success text-center mb-2">{success}</div> }
            <div className="d-flex justify-content-center">
                <button className="profile-password__confirm btn btn-danger" onClick={handleChangePassword}>
                    Xác nhận
                </button>
            </div>
        </div>
    )
}
