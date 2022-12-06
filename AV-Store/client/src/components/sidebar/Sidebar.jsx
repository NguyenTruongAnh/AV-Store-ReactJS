import './sidebar.css'

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-item">
                <span className="sidebar-title">ABOUT US</span>
                <img
                    src="https://i.pinimg.com/originals/7a/23/8f/7a238f0e6cbc0d76d6511bb5dca4d3a1.jpg"
                    alt="Avatar"
                />
                <p className="text-center">
                    Anh Vũ Store <br />
                    Chuyên quần áo hiệu chất lượng cao
                </p>
            </div>
            <div className="sidebar-item">
                <span className="sidebar-title">FOLLOW US</span>
                <div className="sidebar-socials">
                    <a href="#" className="text-secondary">
                        <i className="sidebar-icon fab fa-facebook-square"></i>
                    </a>
                    <a href="#" className="text-dark">
                        <i className="sidebar-icon fab fa-instagram-square"></i>
                    </a>
                    <a href="#" className="text-secondary">
                        <i className="sidebar-icon fab fa-twitter-square"></i>
                    </a>
                    <a href="#" className="text-dark">
                        <i className="sidebar-icon fab fa-pinterest-square"></i>
                    </a>
                </div>
            </div>
        </div>
    )
}
