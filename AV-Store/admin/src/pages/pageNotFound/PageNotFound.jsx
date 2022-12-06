import './pageNotFound.css'
import './pageNotFoundResponsive.css'
import { TabTitle } from '../../utils/GeneralFunction'

export default function PageNotFound() {
    TabTitle('AV Admin - Page not found')
    return (
        <div className="page-not-found">
            Page Not Found
        </div>
    )
}