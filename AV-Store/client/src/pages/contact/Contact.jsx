import './contact.css'
import './contactResponsive.css'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Contact() {
    TabTitle('AV Store - Liên hệ')

    return (
        <div className="contact">
            <div className="container">
                <div className="contact-titles">
                    <span className="contact-title contact-title--sm">Liên hệ</span>
                    <span className="contact-title contact-title--lg">Anh Vũ Store</span>
                </div>
                <div className="contact-content">
                    <div className="contact-item">
                        <h3>Thông tin liên hệ:</h3>
                        <div className="contact-item__contacts">
                            <div className="container-fruid">
                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="d-flex align-items-center mb-4">
                                            <i className="contact-icon fa-solid fa-phone-volume"></i>
                                            <span>
                                                Hotline: 0397979797
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="d-flex align-items-center mb-4">
                                            <i className="contact-icon fa-solid fa-envelope"></i>
                                            <span>
                                                Email: anhvustore@anhvu.com
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="d-flex align-items-center mb-4">
                                            <i className="contact-icon fa-solid fa-location-dot"></i>
                                            <span>
                                                HCM: Q7, HCM
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-item">
                        <h3>Mạng xã hội:</h3>
                        <ul className="contact-item__socials">
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=100035256339240" className="text-secondary">
                                    <i className="fa-brands fa-facebook-square"></i>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=100035256339240" className="text-dark">
                                    <i className="fa-brands fa-instagram-square"></i>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=100035256339240" className="text-secondary">
                                    <i className="fa-brands fa-twitter-square"></i>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=100035256339240" className="text-dark">
                                    <i className="fa-brands fa-pinterest-square"></i>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="contact-item">
                        <h3>Bản đồ:</h3>
                        <ul className="contact-item__maps">
                            <li>
                                {/* <p>Chi nhánh Hồ Chí Minh:</p> */}
                                <iframe 
                                    title="HCM"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.023456349856!2d106.69758091533397!3d10.73267416293323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2747a81a3%3A0x33c1813055acb613!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBUw7RuIMSQ4bupYyBUaOG6r25n!5e0!3m2!1svi!2s!4v1651752658791!5m2!1svi!2s"
                                    allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </li>
                            {/* <li>
                                <p>Chi nhánh Hà Nội:</p>
                                <iframe 
                                    title="HN"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14899.758931987424!2d105.80838163709022!3d20.995052809466603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9642e7777d%3A0x412403da0c4dd792!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIFjDoyBo4buZaSB2w6AgTmjDom4gdsSDbiAtIMSQ4bqhaSBo4buNYyBRdeG7kWMgZ2lhIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1651753215512!5m2!1svi!2s" 
                                    allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}