import './pagination.css'
import './paginationResponsive.css'

import CurrencyFormat from 'react-currency-format'

export default function Pagination({ currentPage, setCurrentPage, maxPage, handlePreviousPage, handleNextPage, handlePageEnter }) {

    return (
        <div className="pagination">
            <ul className="pagination__list">
                {currentPage.page && currentPage.page > 1 ? (
                    <li
                        className="pagination__item"
                        onClick={() => handlePreviousPage()}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </li>
                ) : (
                    <li
                        className="pagination__item invalid"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </li>
                )}
                <li className="pagination__item">
                    <CurrencyFormat
                        value={currentPage.page}
                        thousandSeparator={true}
                        displayType="input"
                        onValueChange={(values) => {
                            const { value } = values

                            if (value === '-' || !value) {
                                setCurrentPage({
                                    page: ''
                                })
                            } else {
                                const newPage = parseInt(value) 

                                if (newPage < 1) {
                                    setCurrentPage({
                                        page: 1
                                    })
                                } else if (newPage > maxPage) {
                                    setCurrentPage({
                                        page: maxPage
                                    })
                                } else {
                                    setCurrentPage({
                                        page: newPage
                                    })
                                }
                            }
                        }}
                        onKeyUp={(e) => handlePageEnter(e)}
                    />
                    <span>Max: {maxPage}</span>
                </li>
                {currentPage.page && currentPage.page < maxPage ? (
                    <li
                        className="pagination__item"
                        onClick={() => handleNextPage()}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </li>
                ) : (
                    <li
                        className="pagination__item invalid"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </li>
                )}
            </ul>
        </div>
    )
}
