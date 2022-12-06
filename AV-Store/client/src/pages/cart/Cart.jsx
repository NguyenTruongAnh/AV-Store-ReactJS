import './cart.css'
import './cartResponsive.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CartProduct from '../../components/cartProduct/CartProduct'
import CustomSelection from '../../components/customSelection/CustomSelection'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { formatter } from '../../utils/formatMoney'
import { Modal, Button } from 'react-bootstrap'
import { tokenExpires } from '../../redux/userRedux'
import { clear } from '../../redux/cartRedux'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Cart() {
    TabTitle('AV Store - Giỏ hàng của bạn')

    const tokenGHN = "a607cce7-4e23-11ed-b26c-02ed291d830a"
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.currentUser.others);
    const accessToken = useSelector(state=>state.user.currentUser.accessToken)
    const cart = useSelector(state=>state.cart)
    const [name, setName] = useState(user.name)
    const [phone, setPhone] = useState(user.phone)
    const [email, setEmail] = useState(user.email)
    const [address, setAddress] = useState(user.address ? user.address.address : "")
    const [note, setNote] = useState("")
    const [payment, setPayment] = useState('')
    const [mess, setMess] = useState("Something wrong")
    const [showModal, setShowModal] = useState(false)
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
    const [orderId, setOderId] = useState("")
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

    const handleSelectProvince = (value) => {
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
        }
        setShowDistrict(false)
    }

    const handleSelectWard = (value) => {
        setWard(value)
        setShowWard(false)
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
    
    const handleCreateOrder = async () => {
        if(address && payment) {
            try {
                let products = [] 
                cart.products.forEach(product => {
                    products.push({
                        sampleId : product.sampleId,
                        quantity: product.quantity,
                        size: product.size
                    })
                })
                const order = {
                    products,
                    amount: cart.total,
                    address: {
                        province,
                        district,
                        ward,
                        address
                    },
                    note,
                    payment
                }
                const res = await axios.post("/orders/", order, {
                    headers: {
                        'Authorization': `Beaer ${accessToken}`
                    }
                });
                const resData = res.data
                if(resData.code === 0) {
                    setOderId(resData.data)
                    setIsPaymentSuccess(true)
                    dispatch(clear())
                } else if(resData.code === 2) {
                    dispatch(tokenExpires())
                } else {
                    setMess(resData.message)
                    setShowModal(true)
                }
            } catch (err) {}
        } else {
            setMess("Vui lòng nhập địa chỉ giao hàng và chọn hình thức thanh toán!")
            setShowModal(true)
        }
    }

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
        <div className="cart">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-xl-6 mb-4">
                        <div className="cart-left">
                            <h2 className="cart-title">
                                Giỏ hàng
                            </h2>
                            <div className="cart-products">
                                {cart.products.map((product, index) => 
                                    (<CartProduct 
                                        sampleId={product.sampleId} 
                                        q={product.quantity}
                                        size={product.size}
                                        color={product.color}
                                        key={product.sampleId}
                                    />)
                                )}
                            </div>
                            <div className="cart-summary">
                                <div className="cart-summary__item">
                                    <span className="cart-summary__item-text">Phí giao hàng</span>
                                    <span className="cart-summary__item-price">Miễn phí</span>
                                </div>
                                <div className="cart-summary__item cart-summary__item--total">
                                    <span className="cart-summary__item-text">Tổng tiền</span>
                                    <span className="cart-summary__item-price">{formatter.format(cart.total)}đ</span>
                                </div>
                            </div>
                            <Link className="link cart-shopping" to="/collections">
                                Tiếp tục mua hàng
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-xl-6 mb-4">
                        {!isPaymentSuccess ? (
                            <div className="cart-right">
                                <h2 className="cart-title">
                                    Thông tin vận chuyển
                                </h2>
                                <div className="cart-form">
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <input type="text" className="form-control" 
                                                placeholder="Họ tên" 
                                                value={name}
                                                disabled
                                                onChange={(e) => setName(e.target.value)}    
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <input type="number" className="form-control" 
                                                placeholder="Số điện thoại" 
                                                value={phone}
                                                disabled
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control" 
                                            placeholder="Email" 
                                            disabled
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
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
                                        </div>
                                        <div className="form-group col-md-4">
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
                                        </div>
                                        <div className="form-group col-md-4">
                                            <CustomSelection
                                                show={showWard}
                                                setShow={setShowWard}
                                                handleSelect={handleSelectWard}
                                                selectValue={ward}
                                                options={wards}
                                                zIndex={1}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" 
                                            placeholder="Địa chỉ" 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}    
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" 
                                            placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)" 
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <h2 className="cart-title">
                                    Hình thức thanh toán
                                </h2>
                                <div className="cart-payments">
                                    <label
                                        htmlFor="cart-payment__cod"
                                        className={payment === 'COD' ? "cart-payment active" : "cart-payment"}
                                        onClick={() => setPayment('COD')}
                                    >
                                        <input className="cart-payment__radio" id="cart-payment__cod"
                                            type="radio" name="payments" value="COD"
                                        />
                                        <span className="cart-payment__img">
                                            <img src="/images/payments/COD.jpg" alt="" />
                                        </span>
                                        <span className="cart-payment__name">Thanh toán khi nhận hàng</span>
                                    </label>
                                    <label
                                        htmlFor="cart-payment__momo"
                                        className={payment === 'MoMo' ? "cart-payment active" : "cart-payment"}
                                        onClick={() => setPayment('MoMo')}
                                    >
                                        <input className="cart-payment__radio" id="cart-payment__momo"
                                            type="radio" name="payments" value="MoMo"
                                        />
                                        <span className="cart-payment__img">
                                            <img src="/images/payments/MoMo.jpg" alt="" />
                                        </span>
                                        <span className="cart-payment__name">MOMO</span>
                                    </label>
                                    <label
                                        htmlFor="cart-payment__zalopay"
                                        className={payment === 'ZaloPay' ? "cart-payment active" : "cart-payment"}
                                        onClick={() => setPayment('ZaloPay')}
                                    >
                                        <input className="cart-payment__radio" id="cart-payment__zalopay"
                                            type="radio" name="payments" value="ZaloPay"
                                        />
                                        <span className="cart-payment__img">
                                            <img src="/images/payments/ZaloPay.jpg" alt="" />
                                        </span>
                                        <span className="cart-payment__name">Ví điện tử ZaloPay</span>
                                    </label>
                                    <label
                                        htmlFor="cart-payment__shopeepay"
                                        className={payment === 'ShopeePay' ? "cart-payment active" : "cart-payment"}
                                        onClick={() => setPayment('ShopeePay')}
                                    >
                                        <input className="cart-payment__radio" id="cart-payment__shopeepay"
                                            type="radio" name="payments" value="ShopeePay"
                                        />
                                        <span className="cart-payment__img">
                                            <img src="/images/payments/ShopeePay.jpg" alt="" />
                                        </span>
                                        <span className="cart-payment__name">Ví điện tử ShopeePay</span>
                                    </label>
                                </div>

                                <button className="cart-checkout" onClick={handleCreateOrder}>Đặt hàng</button>
                            </div>
                        ) : (
                            <div className="cart-right">
                                <div className="cart-paid">
                                    <div className="cart-paid__title">
                                        <span>Đặt hàng thành công</span>
                                        <span>Cảm ơn bạn đã mua hàng tại Anh Vũ Store</span>
                                    </div>
                                    <div className="cart-paid__content">
                                        <div className="cart-paid__content-title">
                                            Thông tin đơn hàng
                                        </div>
                                        <ul className="cart-paid__content-list">
                                            <li className="cart-paid__content-item">
                                                <b>Mã đơn hàng:</b> {orderId}
                                            </li>
                                            <li className="cart-paid__content-item">
                                                <b>Họ tên:</b> {name}
                                            </li>
                                            <li className="cart-paid__content-item">
                                                <b>Số điện thoại:</b> {phone}
                                            </li>
                                            <li className="cart-paid__content-item">
                                                <b>Email:</b> {email}
                                            </li>
                                            <li className="cart-paid__content-item">
                                                <b>Địa chỉ:</b> {`${address} ${ward.name} ${district.name} ${province.name}`}
                                            </li>
                                            <li className="cart-paid__content-item">
                                                <b>Ghi chú:</b> {note ? note: "Không"}
                                            </li>
                                            <li className="cart-paid__content-item">
                                                <b>Phương thức thanh toán:</b> {payment}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>    
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>{mess}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
