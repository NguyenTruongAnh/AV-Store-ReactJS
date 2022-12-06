import './customSelection.css'
import './customSelectionResponsive.css'

import { useRef, useEffect } from 'react'

export default function CustomSelection({ show, setShow, handleSelect, selectValue, options, zIndex=1 }) {
    const customSelectionElement = useRef(null)

    useEffect(() => {
        const handleClickOutsiteSelection = function (event) {
            if (!customSelectionElement.current.contains(event.target) && show) {
                setShow(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutsiteSelection)

        return () => {
            document.removeEventListener('mousedown', handleClickOutsiteSelection)
        }
    })

    return (
        <div 
            className={show ? "custom-selection active" : "custom-selection"}
            ref={customSelectionElement}
            style={{zIndex: zIndex}}
        >
            <div 
                className="custom-selection__value"
                onClick={() => setShow(!show)}
            >
                <span>{selectValue.name}</span>
                <i className="fa-solid fa-chevron-down"></i>
            </div>
            <ul className="custom-selection__options">
                {options.length > 0 ? (
                    options.map((option, index) => (
                        <li 
                            key={index}
                            onClick={() => handleSelect(option)}
                        >
                            {option.name}
                        </li>
                    ))
                ) : (
                    <li onClick={() => setShow(false)}>
                        Không có dữ liệu
                    </li>
                )}
            </ul>
        </div>
    )
}