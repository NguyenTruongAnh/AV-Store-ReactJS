import './collections.css'
import './collectionsResponsive.css'

import CollectionsFilter from '../../components/collectionsFilter/CollectionsFilter'
import CollectionsList from '../../components/collectionsList/CollectionsList'
import { TabTitle } from '../../utils/GeneralFunction'

export default function Collections() {
    TabTitle('AV Store - Bộ sưu tập')

    return (
        <div className="collections">
            <div className="collections-titles">
                <span className="collections-title collections-title--sm">Danh mục sản phẩm</span>
                <span className="collections-title collections-title--lg">Anh Vũ Store</span>
            </div>
            <span className="collections-line"></span>
            <CollectionsFilter />
            <span className="collections-line"></span>
            <CollectionsList />
        </div>
    )
}
