import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { ItemPropsContext } from '../../context/itemPropsContext'
import { AiFillCheckCircle } from 'react-icons/ai'
import { BsChevronBarDown } from 'react-icons/bs'

import { DotSpinner } from '@uiball/loaders'

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import './product.css'

import placeholderImg from '../../assets/placeholder-image.jpg'

const Product = () => {
    const { token, setCartCount, cartCount } = useContext(ItemPropsContext)

    const { product } = useParams()
    const navigate = useNavigate()

    const [productItem, setProductItem] = useState({})
    const [productPrice, setProductPrice] = useState()
    const [addedToCartNotification, setAddedToCartNotification] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingBtn, setLoadingBtn] = useState(false)
    const [displayShowMore, setDisplayShowMore] = useState(true)

    const showNotification = () => {
        setAddedToCartNotification(true)

        setTimeout(() => {
            setAddedToCartNotification(false)
        }, 5000)
    }

    const getProduct = async () => {
        setIsLoading(true)

        await axios.get(`/api/product/item/${product}`)
        .then(response => {
            setProductItem(response.data)
            setProductPrice(response.data.sizes[0])
            setIsLoading(false)
        }).catch(() => navigate("/"))
    }

    useEffect(() => {
        getProduct()
    }, [product])

    const addToCart = async () => {
        setLoadingBtn(true)
        const config = {
            headers: {
                'x-access-token': token
            }
        }
        console.log(token)
        const url = '/api/cart/add'

        const data = {
            'productId': productItem._id,
            'sizeId': productPrice._id
        }

        await axios.post(url, data, config)
        .then(response => {
            showNotification()
            if (response.data.added === 1) {
                const getCartCount = localStorage.getItem('cartCount')
                const newCount = parseInt(getCartCount) + 1
                localStorage.setItem('cartCount', newCount)
                setCartCount(newCount)
            }
        }).catch(err => console.log(err))
        setLoadingBtn(false)
    }

    const addToCartGuest = async () => {
        let storageCart = localStorage.getItem('guestCart')

        if (!storageCart) {
            let addToCart = [
                {
                    'productId': productItem._id,
                    'sizeId': productPrice._id,
                    'quantity': 1
                }
            ]
            localStorage.setItem('guestCart', JSON.stringify(addToCart))
        } else {
            let data = JSON.parse(storageCart)
            
            const existingCart = data.find(q => q.sizeId === productPrice._id)

            if (existingCart) {
                console.log('exisitng')
                let newCart = data.map(item => {
                    if (item.sizeId === productPrice._id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                })
                localStorage.setItem('guestCart', JSON.stringify(newCart))
            }
            else {
                data.push({
                    'productId': productItem._id,
                    'sizeId': productPrice._id,
                    'quantity': 1
                })
                localStorage.setItem('guestCart', JSON.stringify(data))

                if (!cartCount)
                    setCartCount(1)
                else
                    setCartCount(prev => prev + 1)
            }
        }
        showNotification()
    }
    
    return (
        <div className='product-section'>
            <img src="https://inventory.zoho.com/api/v1/items/4466740000000080050/image?authtoken=1000.7f4eeb03ce751d87cef2da7a5cdb73b0.f7b5466724f9406ceb9cd08479d12bcd&organization_id=828204236" alt="Item Image" />

            {addedToCartNotification && <div className="bg-gold text-white  height-60 py-3 px-2 position-fixed added-to-cart">
                <div className='d-flex align-items-center gap-1'>
                    <AiFillCheckCircle className='' /> 
                    <p className='mb-0'>Added to Cart</p>
                </div>
                <Link to="/cart" className='btn-white text-decoration-none'>Go to Cart</Link>
            </div>}
            {isLoading ? 
                <div className="loading-content mx-auto height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <DotSpinner 
                        size={100}
                        speed={0.9} 
                        color="#D39E6C" 
                    />
                    <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
                </div> 
                :
                <>
                {/* <div className="container text-gold d-flex justify-content-center align-items-center product-container mt-0 pt-5 my-5"> */}
                <div className="container text-dim mt-0 pt-5 my-5">
                    <div className='d-flex product-container'>
                        <div className='col'>
                            <Carousel className='custom-carousel text-center' showIndicators={false} showStatus={false}>
                            <div>
                                <img src={placeholderImg} className='img-fluid' />
                            </div>
                            <div>
                                <img src={placeholderImg} className='img-fluid' />
                            </div>
                            <div>
                                <img src={placeholderImg} className='img-fluid' />
                            </div>
                            </Carousel>
                        </div>
                        <div className='col d-flex align-items-center justify-content-center'>
                            <div>
                                <h2 className='d-flex text-gold'>{productItem && productItem.model}<p className='tm-xxsmall mb-0'>TM</p></h2>
                                <p className="mont-light vertical-center-text">{productItem && productItem.specs}</p>
                                <ul className='p-0 product-tags'>
                                    <li>Tag 1</li>
                                    <li>Tag 2</li>
                                    <li>Tag 3</li>
                                </ul>
                                <div>
                                    <p className='m-0'>Size:</p>
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        {(productItem.sizes && productPrice) && productItem.sizes.map(item => {
                                            return (
                                                <button 
                                                    key={item.size} 
                                                    type="button" 
                                                    className={`btn-gold mx-1 ${item._id === productPrice._id ? 'bg-gold text-white' : ''}`}
                                                    onClick={() => setProductPrice(item)}
                                                >{item.size}</button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <h2 className='mt-3'>{productPrice && productPrice.priceAED} AED</h2>
                                </div>
                                <div className='mt-4'>
                                    {token ?
                                        loadingBtn ? 
                                            <button className="btn-gold py-3 px-5 text-center btn-block mb-4" disabled>
                                                <div className="snippet" data-title="dot-pulse">
                                                    <div className="stage">
                                                        <div className="dot-pulse"></div>
                                                    </div>
                                                </div>
                                            </button>
                                            :
                                            <button className='btn-gold py-2 px-4' onClick={() => addToCart()}>add to cart</button>
                                        :
                                        <button className='btn-gold py-2 px-4 text-decoration-none' onClick={() => addToCartGuest()}>add to cart</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row product-features-section'>
                        <div className='col'>
                            <div className='mt-3'>
                                <h4 className='ml-3'>Features</h4>
                                <ul className='d-flex flex-wrap mb-0'>
                                    <li style={{ flexBasis: "50%" }}>Feature 1</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 2</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 3</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 4</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 5</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 6</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 7</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 8</li>
                                    <li style={{ flexBasis: "50%" }}>Feature 9</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col second-col'></div>
                    </div>
                </div>
                </>
            }

            <div className="accordion" id="accordionExample">
                <div className="accordion-item border-0">
                    {displayShowMore && <div className="accordion-header" id="headingOne" onClick={() => setDisplayShowMore(false)}>
                        <div className='accordion-button collapsed d-flex justify-content-center align-items-center text-gold my-5 cursor-pointer' type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <hr className='w-50' />
                            <div className='width-300 text-center'>
                                <h2 className='mb-0'>Show More</h2>
                                <BsChevronBarDown className='show-more-down-icon' />
                            </div>
                            <hr className='w-50' />
                        </div>
                    </div>}
                    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body p-0">
                            <div className='product-more-section'>
                                <div className="product-more-child other-product-section d-flex text-white letter-spacing-1 mt-3 mb-5 shadow-sm">
                                    <div className='d-flex flex-column justify-content-center align-items-center bg-gold'>
                                        <div className='other-product-div'>
                                            <div className='other-product-text-holder mx-auto other-product-div-1'>
                                                <h2 className='font-weight-bold'>Pillows of JourneyTM</h2>
                                                <p className='line-height-normal'>Sleeping is our way of giving back, even not fully conscious we reconnect with the self.</p>
                                                <button className='btn-white'>see product</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='other-product-image-holder'>
                                        <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                                    </div>
                                </div>

                                <div className="product-more-child product-mid-header text-white shadow-sm placeholder-image" style={{ backgroundImage: `url(${placeholderImg})`}}>
                                    <div className='text-center'>
                                        <h2 className='letter-spacing-3'>Discover Journey pijamas</h2>
                                        <button className='mt-2 btn-white'>find more</button>
                                    </div>
                                </div>

                                <div className="product-more-child other-product-section d-flex text-white letter-spacing-1 my-5 shadow-sm">
                                    <div className='other-product-image-holder'>
                                        <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center bg-gold'>
                                        <div className='other-product-div'>
                                            <div className='other-product-text-holder mx-auto other-product-div-1'>
                                                <h2 className='font-weight-bold'>Pillows of JourneyTM</h2>
                                                <p className='line-height-normal'>Sleeping is our way of giving back, even not fully conscious we reconnect with the self.</p>
                                                <button className='btn-white'>see product</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-more-child header-container text-white placeholder-image" style={{ backgroundImage: `url(${placeholderImg})`}}>
                                    <div className='header-one-content text-center'>
                                        <h3 className='letter-spacing-3'>JOURNEY TO YOUR INNER SELF</h3>
                                        <p>#yogabeds</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* <div className='d-flex justify-content-center align-items-center text-gold my-5 cursor-pointer'>
                <hr className='w-50' />
                <div className='width-300 text-center'>
                    <h2 className='mb-0'>Show More</h2>
                    <BsChevronBarDown className='show-more-down-icon' />
                </div>
                <hr className='w-50' />
            </div> */}
        </div>
    )
}

export default Product