import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import placeholderImg from '../../assets/placeholder-image.jpg'

import './library.css'

const Library = () => {
    return (
        <>
            <div className='placeholder-image' style={{ backgroundImage: `url(${placeholderImg})` }}>
                <div className='container'>
                    <div className='row height-40vh align-items-center'>
                        <div className='col-5'>
                            <h2 className='text-gold'>Welcome to Sleep (101)</h2>
                            <p className='text-white'>Your gateway to understanding the fundamentals of sleep. Whether you're new to the topic or seeking a refresher, this section is your go-to resource. Dive into the essentials of sleep science, debunk common myths, and uncover the profound influence sleep has on our lives. Get ready for an enlightening exploration into the world of slumber.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container my-5 section-products'>
                <div>
                    <h2 className='text-gold section-title'>About Pre-Sleep</h2>
                    <Splide
                        options={ {
                            perPage: 4,
                            arrows: false,
                            pagination: false,
                            drag: "free",
                            gap: "1rem"
                        } }
                        aria-label="My Favorite Images"
                        
                    >
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                    </Splide>
                </div>
                <div className="mt-5">
                    <h2 className='text-lblue section-title'>Sleep</h2>
                    <Splide
                        options={ {
                            perPage: 4,
                            arrows: false,
                            pagination: false,
                            drag: "free",
                            gap: "1rem"
                        } }
                        aria-label="My Favorite Images"
                        
                    >
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                    </Splide>
                </div>
                <div className="mt-5">
                    <h2 className='text-lgray section-title'>Post-Sleep</h2>
                    <Splide
                        options={ {
                            perPage: 4,
                            arrows: false,
                            pagination: false,
                            drag: "free",
                            gap: "1rem"
                        } }
                        aria-label="My Favorite Images"
                        
                    >
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="col-md-6 col-lg-4 col-xl-3 width-300">
                                <div id="product-1" className="single-product placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                                    <div className="part-1">
                                        <ul>
                                            <li><a href="#"><h2 className='mb-0'>tetx herer</h2></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                    </Splide>
                </div>
            </div>

            {/* <div className='d-flex flex-wrap justify-content-center gap-3'>

                <div className="text-center rounded bg-info p-4" style={{ flexBasis: '45%' }}>
                    <h2>Agoy</h2>
                    <p>Supporting Text</p>
                    <h3 className='mt-2'>123456789010</h3>
                    <p>Date</p>
                    <h4 className='mt-2'>Sample Name</h4>
                </div>


                <div className="text-center rounded bg-info p-4" style={{ flexBasis: '45%' }}>
                    <h2>Agoy</h2>
                    <p>Supporting Text</p>
                    <h3 className='mt-2'>123456789010</h3>
                    <p>Date</p>
                    <h4 className='mt-2'>Sample Name</h4>
                </div>

            </div> */}
        </>
    )
}

export default Library