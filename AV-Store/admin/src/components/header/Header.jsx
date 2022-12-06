import './header.css'
import './headerResponsive.css'
import { useSelector} from 'react-redux'
export default function Header() {
    const { name, avatar } = useSelector((state) => state.user.currentUser.others);
    return (
        <div className="header">
            <div className="header-left">
                <div className="header-logo">
                    <div className="header-logo__img"></div>
                    <span className="d-none d-md-inline-block">Anh Vũ Store Admin</span>
                </div>
            </div>
            <div className="header-right">
                <span className="header-name">Xin chào, {name}</span>
                <img className="header-avatar" src={avatar} alt="Avatar" />
            </div>
        </div>
    )
}
