import './customSelection.css'
import './customSelectionResponsive.css'

import { useRef, useEffect } from 'react'

export default function CustomSelection({ options, isOpenSelection, setIsOpenSelection, selectionValue, handleSelection }) {
    const selectionElement = useRef(null)

    useEffect(() => {
        const handleClickOutsiteSelection = function (event) {
            if (!selectionElement.current.contains(event.target) && isOpenSelection) {
                setIsOpenSelection(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutsiteSelection)

        return () => {
            document.removeEventListener('mousedown', handleClickOutsiteSelection)
        }
    })

    return (
        <div 
            ref={selectionElement}
            className={isOpenSelection ? "custom-selection active" : "custom-selection"}
        >
            <div
                className="custom-selection__selected"
                onClick={() => setIsOpenSelection(!isOpenSelection)}
            >
                {selectionValue}
                <i className="fa-solid fa-angle-down"></i>
            </div>
            <ul className="custom-selection__options">
                {options.map((option, index) => (
                    <li 
                        key={index}
                        onClick={() => handleSelection(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    )
}
