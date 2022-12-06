import './profile.css'
import './profileResponsive.css'

import ProfileInfo from '../../components/profileInfo/ProfileInfo'
import ProfileOrders from '../../components/profileOrders/ProfileOrders'
import ProfilePassword from '../../components/profilePassword/ProfilePassword'
import ProfileSidebar from '../../components/profileSidebar/ProfileSidebar'

import { useParams, useLocation } from 'react-router-dom'
import OrderDetail from '../../components/orderDetail/OrderDetail'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Profile() {
    TabTitle('AV Store - Tài khoản của bạn')

    const location = useLocation()
    let params = new URLSearchParams(location.search)
    let { view } = useParams()

    return (
        <div className="profile">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-4 col-xl-3">
                        <ProfileSidebar view={view} type={params.get('type')} orderId={params.get('id')} />
                    </div>
                    <div className="col-12 col-lg-8 col-xl-8">
                        { !params.get('id') 
                        ? (
                            <>
                                {
                                    view === "profile" && (
                                        <ProfileInfo />
                                    )
                                }
                                {
                                    view === "orders" && (
                                        <ProfileOrders type={params.get('type')} />
                                    )
                                }
                                {
                                    view === "password" && (
                                        <ProfilePassword />
                                    )
                                }
                            </>
                        ) 
                        : (
                            <OrderDetail />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
