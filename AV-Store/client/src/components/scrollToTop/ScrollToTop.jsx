import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import "./scrollToTop.css"

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)
    const { pathname } = useLocation()

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [pathname])

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)

        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [pathname])

    return (
        <div className={isVisible ? "scroll-to-top active" : "scroll-to-top"}>
            <div onClick={scrollToTop}>
                <i className="fa-regular fa-circle-up"></i>
            </div>
        </div>
    )
}