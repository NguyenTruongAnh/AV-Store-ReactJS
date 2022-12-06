import './confirmAccount.css'
import './confirmAccountResponsive.css'

import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ConfirmAccount() {
    const param = useParams();
    const [isValid, setIsValid] = useState("")

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const { data } = await axios.get(`/auth/verify/${param.token}`)
                console.log(data)
                setIsValid("success")
            } catch (error) {
                console.log(error)
                setIsValid("fail")
            }
        }
        verifyEmailUrl()
    }, [param])

    return (
        {
            'success' : (<div className="confirm-account">
                <img
                    className="confirm-account__img"
                    src="/images/confirm-account-success.png"
                    alt="Hình ảnh"
                />
                <h1 className="confirm-account__title text-success text-center">
                    "Xác thực tài khoản thành công"
                </h1>
                <div className="confirm-account__message">
                    <p className="text-center">Bây giờ bạn có thể đăng nhập tài khoản vào hệ thống</p>
                    <p className="text-center">Nhấn vào <Link to="/login">đây</Link> để đăng nhập </p>
                </div>
            </div>),
            'fail' : (<div className="confirm-account">
            <img
                className="confirm-account__img"
                src="/images/confirm-account-failure.png"
                alt="Hình ảnh"
            />
            <h1 className="confirm-account__title text-danger text-center">
                "Xác thực tài khoản thành công"
            </h1>
            <div className="confirm-account__message">
                <p className="text-center">Nhấn vào <Link to="/resend-confirm">đây</Link> lấy mã xác thực mới</p>
            </div>
        </div>),
            "" : (<div></div>)
        }[isValid]
    )
}
