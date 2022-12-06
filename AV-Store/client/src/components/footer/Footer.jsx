import './footer.css'

export default function Footer() {
    return (
        <div className="footer">
            <div className="footer-logo">
                <div className="footer-logo__img"></div>
                <span>Anh Vũ Store</span>
                <p className="mb-1">Đặt hàng và thu tiền mọi nơi trên toàn quốc</p>
                <h4>0397979797</h4>
                <a href="#">Xem thông tin về Anh Vũ Store</a>
            </div>
            <p className="footer-logo__copyright">Copyright © 2022 Nguyễn Trường Anh</p>
        </div>
    )
}