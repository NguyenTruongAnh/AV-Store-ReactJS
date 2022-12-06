import './home.css'
import './homeResponsive.css'

import CurrencyFormat from 'react-currency-format'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { randomColor } from 'randomcolor'
import { TabTitle } from '../../utils/GeneralFunction'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Home() {
    TabTitle('AV Admin - Trang chủ')

    const categoryDatas = [
        {
            type: 'Áo',
            amount: 120.
        },
        {
            type: 'Quần',
            amount: 50.
        },
        {
            type: 'Giày',
            amount: 80.
        },
        {
            type: 'Phụ kiện',
            amount: 160.
        },
    ]

    const bestSellerOfCategories = [
        {
            categoryId: 1,
            categoryName: 'Áo',
            bestSeller: {
                id: 1,
                name: 'Áo vest nam',
                image: '/images/products/ao1.jpg'
            }
        },
        {
            categoryId: 2,
            categoryName: 'Quần',
            bestSeller: {
                id: 1,
                name: 'Quần tây nam',
                image: '/images/products/quan1.jpg'
            }
        },
        {
            categoryId: 1,
            categoryName: 'Giày',
            bestSeller: {
                id: 1,
                name: 'Giày tây nam',
                image: '/images/products/giay1.jpg'
            }
        },
        {
            categoryId: 1,
            categoryName: 'Phụ kiện',
            bestSeller: {
                id: 1,
                name: 'Đồng hồ',
                image: '/images/products/phukien1.jpg'
            }
        },
    ]

    const randomColors = categoryDatas.map(() => randomColor())

    const pieData = {
        labels: categoryDatas.map((categoryData) => categoryData.type),
        datasets: [
            {
                label: '# of Votes',
                data: categoryDatas.map((categoryData) => categoryData.amount),
                backgroundColor: randomColors,
                borderColor: randomColors,
                borderWidth: 1,
            },
        ],
    }

    return (
        <div className="home page">
            <h1 className="home__title page__title">Trang chủ</h1>
            <div className="home__content">
                <div className="container-fluid">
                    <div className="row">
                        {/* Left */}
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-md-6 offset-md-3 col-lg-8 offset-lg-2">
                                    <Pie data={pieData} />
                                    <p className="text-center">Lượng sản phẩm bán ra của từng danh mục</p>
                                </div>
                            </div>

                            <div className="home__income">
                                <span>Tổng doanh thu</span>
                                <CurrencyFormat value={10000000} displayType={'text'} thousandSeparator={true} suffix={' đ'} />
                            </div>
                        </div>

                        {/* Right */}
                        <div className="col-lg-6">
                            <h5>Sản phẩm bán chạy</h5>
                            <ul className="home__best-seller row">
                                {bestSellerOfCategories.map((data, index) => (
                                    <li 
                                        key={index}
                                        className="home__best-seller-item col-12 col-md-6"
                                    >
                                        <div className="home__best-seller-item-title">{data.categoryName}</div>
                                        <div className="home__best-seller-item-product">
                                            <img src={data.bestSeller.image} alt="Hình ảnh" />
                                            <Link to={`/products/detail/${data.bestSeller.id}`}>
                                                {data.bestSeller.name}
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
