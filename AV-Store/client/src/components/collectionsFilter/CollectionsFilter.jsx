import './collectionsFilter.css'
import './collectionsFilterResponsive.css'

import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function CollectionsFilter() {
    const categories = useSelector((state) => state.category.categories);
    return (
        <div className="collections-filter">
            {categories.map((category, index) => (
                <div className="collections-option" key={index}>
                <Link to={`/collection/${category.slug}`}>
                    <img src={category.imgSmall} alt="Image" />
                    <span>{category.name}</span>
                </Link>
                </div>
            ))}
        </div>
    )
}