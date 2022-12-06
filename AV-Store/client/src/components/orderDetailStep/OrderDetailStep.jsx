import './orderDetailStep.css'
import './orderDetailStepResponsive.css'

export default function OrderDetailStep({ currentStep, isOpenSteps, handleOpenSteps, orderStatus }) {
    const steps = {
        'wait-confirm': {
            'icon': 'fa-solid fa-rectangle-list',
            'title': 'Đơn hàng đã đặt'
        },
        'paid-online': {
            'icon': 'fa-solid fa-money-check-dollar',
            'title': 'Đã xác nhận thông tin thanh toán'
        },
        'picked': {
            'icon': 'fa-solid fa-truck-fast',
            'title': 'Đã giao cho đơn vị vận chuyển'
        },
        'complete': {
            'icon': 'fa-solid fa-check-to-slot',
            'title': 'Giao thành công'
        },
        'cancel': {
            'icon': 'fa-solid fa-circle-xmark',
            'title': 'Đơn hàng đã hủy'
        },
        'return': {
            'icon': 'fa-solid fa-rotate-left',
            'title': 'Đơn hàng đã hoàn trả'
        },
        'rating': {
            'icon': 'fa-solid fa-star',
            'title': 'Đánh giá'
        }
    }

    return (
        <div className="order-detail-step">
            <div className="order-detail-step__title d-md-none">
                <span>Tình trạng đơn hàng</span>
            </div>
            <div className={isOpenSteps ? "order-detail-step__list active" : "order-detail-step__list"}>
                {orderStatus.map((s, i) => (
                    <div className={(currentStep === s ? "order-detail-step__item active" : "order-detail-step__item")} key={i}>
                        <i className={`order-detail-step__item-icon ${steps[s].icon}`}></i>
                        <div>
                            <span className="order-detail-step__item-title">
                                {steps[s]['title']}
                            </span>
                        </div>
                    </div>
                ))}
                <div className="order-detail-step__item-line"></div>
            </div>
            <div
                className={isOpenSteps ? "order-detail-step__open--mobile active d-md-none" : "order-detail-step__open--mobile d-md-none"}
                onClick={() => handleOpenSteps(!isOpenSteps)}
            >
                <i className="fa-solid fa-chevron-down"></i>
            </div>
        </div>
    )
}
