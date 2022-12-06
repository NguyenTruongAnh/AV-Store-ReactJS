import './collectionsList.css'
import './collectionsListResponsive.css'

import CollectionsItem from '../collectionsItem/CollectionsItem';
import { useSelector } from "react-redux";

export default function CollectionsList() {
    const categories = useSelector((state) => state.category.categories);

    return (
        <div className="collections-list">
            {categories.map((category, index) => 
                (<CollectionsItem 
                    key={index}
                    name={category.name} 
                    link={`/collection/${category.slug}`} 
                    cat={category._id}
                    img={category.imgLarge} />
                )
            )}
        </div>
    )
}