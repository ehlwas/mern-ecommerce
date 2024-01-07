import { Link } from 'react-router-dom'

import presleep from '../../assets/presleep.svg'
import sleep from '../../assets/sleep.svg'
import postsleep from '../../assets/postsleep.svg'

import './shop-categories.css'

const ShopCategories = () => {
    return (
        <>
            {/* HEADER */}
            <div className="shop-header-container text-white bg-gold">
                <div className='shop-header-one-content text-center'>
                    <h1>-</h1>
                    <h2 className='shop-title letter-spacing-3 mt-5'>IT’S TIME TO EXPERIENCE THE REAL “SLEEPING EXPERIENCE”</h2>
                    <p>Shop our favourite products</p>
                
                    {/* <button className='mt-5 btn-white'>discover collection</button> */}
                </div>
            </div> 

            <div className='container-lg my-5'>
                <div className='d-flex flex-wrap justify-content-around shop-category-container'>
                    <Link to='Pre-Sleep' className='shop-category-box text-center text-decoration-none'>
                        <img src={presleep} className='img-fluid category-image' alt='Pre-Sleep' />
                    </Link>

                    <Link to='Sleep' className='shop-category-box text-center text-decoration-none'>
                        <img src={sleep} className='img-fluid category-image' alt='Sleep' />
                    </Link>

                    <Link to='postsleep' className='shop-category-box text-center text-decoration-none'>
                        <img src={postsleep} className='img-fluid category-image' alt='Post-Sleep' />
                    </Link>
                </div>
                {/* <div className='shop-category-pre mt-5'>
                    <div className='d-flex justify-content-center align-items-center mb-4'>
                        <div className='pre-line-lg'></div>
                        <h2 className='text-gold'>PRE-SLEEP EXPERIENCE</h2>
                    </div>

                    <div className='shop-category item-container d-flex justify-content-between'>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-center'>
                        <Link to='/shop/presleep' className='btn-black'>show more</Link>
                    </div>

                    <hr className='mt-5 mx-auto' />
                </div>

                <div className='shop-category-pre mt-5'>
                    <div className='d-flex justify-content-center align-items-center mb-4'>
                        <div className='s-line-lg'></div>
                        <h2 className='text-lblue'>SLEEP EXPERIENCE</h2>
                    </div>

                    <div className='shop-category item-container d-flex justify-content-between'>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-center'>
                        <Link to='/shop/sleep' className='btn-black'>show more</Link>
                    </div>

                    <hr className='mt-5 mx-auto' />
                </div>

                <div className='shop-category-pre my-5'>
                    <div className='d-flex justify-content-center align-items-center mb-4'>
                        <div className='pos-line-lg'></div>
                        <h2 className='text-lgray'>POST-SLEEP EXPERIENCE</h2>
                    </div>

                    <div className='shop-category item-container d-flex justify-content-between'>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/2836961/pexels-photo-2836961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/2836961/pexels-photo-2836961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/2836961/pexels-photo-2836961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                        <div className='shop-category item-box'>
                            <img src='https://images.pexels.com/photos/2836961/pexels-photo-2836961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='shop-category item-img' />
                            <div className='shop-category item-content d-flex justify-content-between'>
                                <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                                <p className='text-size-xsmall'>$25</p>
                            </div>
                            <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                                <p className='m-0 '>ITEM</p>
                                <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-center'>
                        <button className='btn-black'>show more</button>
                    </div>

                </div> */}
            </div>
        </>
    )
}

export default ShopCategories