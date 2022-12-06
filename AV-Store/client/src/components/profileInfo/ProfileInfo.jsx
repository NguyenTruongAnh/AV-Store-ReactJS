import './profileInfo.css'
import './profileInfoResponsive.css'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import CustomSelection from '../customSelection/CustomSelection'
import axios from "axios";
import { update } from '../../redux/apiCalls'
import { clearMess } from '../../redux/userRedux'

export default function ProfileInfo() {
    const tokenGHN = "a607cce7-4e23-11ed-b26c-02ed291d830a"
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser.others);
    const {isFetching, error, success} = useSelector(state => state.user)
    const [avatar, setAvatar] = useState(user.avatar)
    const [name, setName] = useState(user.name)
    const [file, setFile] = useState(null)
    const [phone, setPhone] = useState(user.phone)
    const [birthday, setBirthday] = useState(user.birthday)
    const [gender, setGender] = useState(user.gender)
    const [showProvince, setShowProvince] = useState(false)
    const [showDistrict, setShowDistrict] = useState(false)
    const [showWard, setShowWard] = useState(false)
    const [province, setProvince] = useState(user.address ? user.address.province : {
        id: -1,
        name: 'Tỉnh / Thành',
    })
    const [provinces, setProvinces] = useState([])
    const [district, setDistrict] = useState(user.address ? user.address.district : {
        id: -1,
        name: 'Quận / Huyện',
    })
    const [districts, setDistricts] = useState([])
    const [ward, setWard] = useState(user.address ? user.address.ward : {
        id: -1,
        name: 'Phường / Xã',
    })
    const [wards, setWards] = useState([])
    const [messError, setMessError] = useState(error)
    const [messSuccess, setMessSuccess] = useState(success)

    const handleChangeImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setAvatar(URL.createObjectURL(e.target.files[0]));
        }
    }

    const handleSelectProvince = async (value) => {
        if (province.id !== value.id) {
            setProvince(value)
            setDistrict({
                id: -1,
                name: 'Quận / Huyện',
            })
            setWard({
                id: -1,
                name: 'Phường / Xã',
            })

            getDistricts(value)
        }
        setShowProvince(false)
    }

    const handleSelectDistrict = (value) => {
        if (district.id !== value.id) {
            setDistrict(value)
            setWard({
                id: -1,
                name: 'Phường / Xã',
            })

            getWards(value)
        }
        setShowDistrict(false)
    }

    const handleSelectWard = (value) => {
        setWard(value)
        setShowWard(false)
    }

    const handleUpdate = async () => {
        if(name && phone && birthday && gender && province.id !== -1 && district.id !== -1 && ward.id !== -1) {
            const info = {
                name,
                phone,
                birthday,
                gender,
                province,
                district,
                ward,
            }

            update(dispatch, info, user._id, file)
        } else {
            setMessError('Vui lòng nhập đầy đủ thông tin!')
        }
    }

    const getWards = async (value) => {
        try {
            const res = await axios.post("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id", 
            {
                district_id : value.id   
            }, {
                headers: {
                "Content-Type": "application/json",
                "Token": tokenGHN,
            }})

            setWards(res.data.data.map((w, index) => ({id: index, name: w.WardName, code: w.WardCode})))
        } catch(err) {}
    }

    const getDistricts = async (value) => {
        try {
            const res = await axios.post("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district", 
            {
                province_id : value.id   
            }, {
                headers: {
                "Content-Type": "application/json",
                "Token": tokenGHN,
            }})
            setDistricts(res.data.data.map(d => ({id: d.DistrictID, name: d.DistrictName, code: d.Code})))
        } catch(err) {}
    }

    useEffect(() => {
        if(success) {
            setMessSuccess(success)
            setMessError(false)
            setTimeout(() => {
                setMessSuccess(false)
                dispatch(clearMess())
            }, 2000)
        }

        if(error) {
            setMessError(error)
            setMessSuccess(false)
        }
    }, [success, error])

    useEffect(() => {
        const getProvinces = async () => {
            try {
                const res = await axios.get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", {
                    headers: {
                       "Content-Type": "application/json",
                       "Token": tokenGHN,
                    }
                })
                setProvinces(res.data.data.map(p => ({ id: p.ProvinceID, name: p.ProvinceName, code: p.Code })))
            } catch (err) {}
        }

        getProvinces()
        if(user.address) {
            getDistricts(user.address.province)
            getWards(user.address.district)
        }
    }, [])

    return (
        <div className="profile-info">
            <h2 className="profile-info__title">Thông tin tài khoản</h2>
            <div className="profile-info__avatar">
                <img
                    className="profile-info__avatar-view"
                    src={avatar}
                    alt="Avatar"
                />
                <label htmlFor="profile-info__avatar-file" className="profile-info__avatar-icon">
                    <i className="fas fa-camera"></i>
                </label>
                <input
                    type="file"
                    id="profile-info__avatar-file"
                    className="profile-info__avatar-file"
                    accept="image/*"
                    onChange={handleChangeImage}
                />
            </div>
            <ul className="profile-info__list">
                <li className="profile-info__item">
                    <span className="profile-info__item-title">Họ và tên</span>
                    <input type="text" className="profile-info__item-input" 
                        placeholder="Họ và tên của bạn" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </li>
                <li className="profile-info__item">
                    <span className="profile-info__item-title">Email</span>
                    <input type="email" className="profile-info__item-input" 
                        placeholder="Email của bạn" disabled 
                        value={user.email} 
                    />
                </li>
                <li className="profile-info__item">
                    <span className="profile-info__item-title">Số điện thoại</span>
                    <input type="number" className="profile-info__item-input" 
                        placeholder="Số điện thoại của bạn" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </li>
                <li className="profile-info__item">
                    <span className="profile-info__item-title">Ngày sinh</span>
                    <input type="date" className="profile-info__item-input" 
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </li>
                <li className="profile-info__item">
                    <span className="profile-info__item-title">Tỉnh/Thành</span>
                    {/* Tỉnh/Thành */}
                    <div className="profile-info__item-select">
                        <CustomSelection
                            show={showProvince}
                            setShow={setShowProvince}
                            handleSelect={handleSelectProvince}
                            selectValue={province}
                            options={provinces}
                            zIndex={3}
                        />
                    </div>

                    {/* Quận/Huyện */}
                    <div className="profile-info__item-select">
                        <CustomSelection
                            show={showDistrict}
                            setShow={setShowDistrict}
                            handleSelect={handleSelectDistrict}
                            selectValue={district}
                            options={districts}
                            zIndex={2}
                        />
                    </div>

                    {/* Phường/Xã */}
                    <div className="profile-info__item-select">
                        <CustomSelection
                            show={showWard}
                            setShow={setShowWard}
                            handleSelect={handleSelectWard}
                            selectValue={ward}
                            options={wards}
                            zIndex={1}
                        />
                    </div>
                </li>
                <li className="profile-info__item">
                    <span className="profile-info__item-title">Giới tính</span>
                    <div className="profile-info__item-radio">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" id="inlineRadio1" 
                                value={1} checked={gender == 1}
                                onChange={(e) => setGender(e.target.value)} />
                            <label className="form-check-label" htmlFor="inlineRadio1">Nam</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" id="inlineRadio2" 
                                value={0} checked={gender == 0}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="inlineRadio2">Nữ</label>
                        </div>
                    </div>
                </li>
            </ul>
            { messSuccess && <div className="text-success text-center mb-2">{messSuccess}</div> }
            { messError && <div className="text-danger text-center mb-2">{messError}</div> }
            <div className="d-flex justify-content-center">
                <button className="profile-info__update btn btn-danger"
                    onClick={handleUpdate} disabled={isFetching}>
                    Cập nhật tài khoản
                </button>
            </div>
        </div>
    )
}
