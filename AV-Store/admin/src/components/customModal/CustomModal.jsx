import './customModal.css'
import './customModalResponsive.css'

export default function CustomModal({ title, message, isOpenModal, setIsOpenModal, handleDelete }) {
    return (
        <div className={isOpenModal ? "custom-modal active" : "custom-modal"}>
            <div className="custom-modal__content">
                <div className="custom-modal__heading">
                    <p>{title}</p>
                    <i
                        className="fa-solid fa-xmark"
                        onClick={() => setIsOpenModal(false)}
                    ></i>
                </div>
                <div className="custom-modal__body">
                    <p>
                        {message}
                    </p>
                </div>
                {handleDelete ?  (<div className="custom-modal__footer">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleDelete()}
                    >
                        Xác nhận
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setIsOpenModal(false)}
                    >
                        Hủy
                    </button>
                </div>) : 
                <div className="custom-modal__footer">
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => setIsOpenModal(false)}
                >
                    Xác nhận
                </button>
            </div> }
                
            </div>
            <div className="custom-modal__overlay" onClick={() => setIsOpenModal(false)}>

            </div>
        </div>
    )
}
