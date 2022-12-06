import './collectionsItem.css'
import './collectionsItemResponsive.css'

import Products from '../products/Products'
import { Link } from 'react-router-dom';

export default function CollectionsItem({ name, link, cat, img }) {
    return (
        <div className="collections-item">
            <div className="collections-item__title">
                <h2>{name}:</h2>
                <Link to={link}>Xem tất cả</Link>
            </div>
            <div className="collections-item__content">
                <Products cat={cat} img={img} />
            </div>
        </div>
    )
}