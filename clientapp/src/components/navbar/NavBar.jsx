import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

import { ItemPropsContext } from '../../context/itemPropsContext';

import { DotSpinner } from '@uiball/loaders'

import AGOYLogo from '../../assets/AGOY.svg'
import AGOYLogoWhite from '../../assets/AGOYwhite.svg'
import placeholderImg from '../../assets/placeholder-image.jpg'

import { AiOutlineMenu, AiOutlineCloseCircle, AiOutlineShoppingCart, AiOutlineRight } from 'react-icons/ai'
import { BsInstagram, BsFacebook, BsTwitter, BsYoutube } from 'react-icons/bs'
import { BiShoppingBag, BiSearch, BiUserCircle } from 'react-icons/bi'
import { MdOutlineNavigateNext, MdOutlineNavigateBefore, MdLanguage, MdOutlineLocationOn } from 'react-icons/md'

import './navbar.css'

const NavBar = () => {
    const { displayDropdown, setDisplayDropdown, firstName, setFirstName, cartCount, decodedToken } = useContext(ItemPropsContext);

    const [selectedNav, setSelectedNav] = useState('')
    const [isScrollAtTop, setIsScrollAtTop] = useState(true);
    const [userSetting, setUserSetting] = useState(false)
    const [burgerLogoDropdown, setBurgerLogoDropdown] = useState(false)
    const [isSearch, setIsSearch] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [isFirstSearch, setIsFirstSearch] = useState(false)

    const navigate = useNavigate();
    
    const bodyScrollOff = () => {
      const style = document.createElement('style');
      style.id = 'turnOffScroll';

      if (displayDropdown)
      {
        style.innerHTML = `
        body {
            overflow: hidden;
        }
        `;
        document.body.appendChild(style);
      }
      else
      {
        const styleElement = document.getElementById('turnOffScroll')
        document.body.removeChild(styleElement); // Remove the style element from the document body
        // style.innerHTML = `
        // body {
        //     overflow: auto;
        // }
        // `;
        // document.body.appendChild(style);
      }
  }

    const selectNavFunction = async (value) => {
      closeSearch()
      if (selectedNav === '' || (selectedNav !== '' && displayDropdown)) {
        setSelectedNav(value)
        setDisplayDropdown(prev => !prev)
        bodyScrollOff()
        return
      }
      setSelectedNav(value)
      if (selectedNav === value && selectedNav) {
        setDisplayDropdown(prev => !prev)
        bodyScrollOff()
        setSelectedNav('')
      }
    }

    const hideDropdownFunction = () => {
      if (!displayDropdown) {
        bodyScrollOff()
      }
      setSelectedNav('')
      setDisplayDropdown(true)
      setIsFirstSearch(false)
    }

    const presleepData = [
      {
          _id: "649d8cb1968ffb9366ce0df1",
          groupId: "648bffecfa0dce77295f67d6",
          categoryName: "Towels",
          itemImageLink: 'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-06-29T13:52:49.134Z",
          updatedAt: "2023-06-29T13:52:49.134Z",
          __v: 0
      },
      {
          _id: "65008cc65798c97c7b1b58b1",
          groupId: "648bffecfa0dce77295f67d6",
          categoryName: "Bathroom Accessories",
          itemImageLink: 'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-09-12T16:07:34.888Z",
          updatedAt: "2023-09-12T16:07:34.888Z",
          __v: 0
      },
      {
          _id: "65008cc65798c97c7b1b58b3",
          groupId: "648bffecfa0dce77295f67d6",
          categoryName: "Sleepwear",
          itemImageLink: 'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-09-12T16:07:34.963Z",
          updatedAt: "2023-09-12T16:07:34.963Z",
          __v: 0
      },
      {
          _id: "65008cc75798c97c7b1b58b5",
          groupId: "648bffecfa0dce77295f67d6",
          categoryName: "Exercise Equipment",
          itemImageLink: 'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-09-12T16:07:35.008Z",
          updatedAt: "2023-09-12T16:07:35.008Z",
          __v: 0
      },
      {
          _id: "65008cc75798c97c7b1b58b7",
          groupId: "648bffecfa0dce77295f67d6",
          categoryName: "Agoy Accessories",
          itemImageLink: 'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-09-12T16:07:35.048Z",
          updatedAt: "2023-09-12T16:07:35.048Z",
          __v: 0
      }
    ]

    const sleepData = [
      {
          _id: "649d8cb1968ffb9366ce0df3",
          groupId: "648bffecfa0dce77295f67d8",
          categoryName: "Mattress",
          itemImageLink: 'https://images.pexels.com/photos/833046/pexels-photo-833046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-06-29T13:52:49.517Z",
          updatedAt: "2023-06-29T13:52:49.517Z",
          __v: 0
      },
      {
          _id: "649d8cb1968ffb9366ce0df5",
          groupId: "648bffecfa0dce77295f67d8",
          categoryName: "Mattress Topper",
          itemImageLink: 'https://images.pexels.com/photos/833046/pexels-photo-833046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-06-29T13:52:49.799Z",
          updatedAt: "2023-06-29T13:52:49.799Z",
          __v: 0
      },
      {
          _id: "649d8cb2968ffb9366ce0df7",
          groupId: "648bffecfa0dce77295f67d8",
          categoryName: "Mattress Protector",
          itemImageLink: 'https://images.pexels.com/photos/833046/pexels-photo-833046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-06-29T13:52:50.155Z",
          updatedAt: "2023-06-29T13:52:50.155Z",
          __v: 0
      },
      {
          _id: "649d8cb2968ffb9366ce0df9",
          groupId: "648bffecfa0dce77295f67d8",
          categoryName: "Pillows",
          itemImageLink: 'https://images.pexels.com/photos/833046/pexels-photo-833046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-06-29T13:52:50.420Z",
          updatedAt: "2023-06-29T13:52:50.420Z",
          __v: 0
      },
      {
          _id: "649d8cb2968ffb9366ce0dfb",
          groupId: "648bffecfa0dce77295f67d8",
          categoryName: "Duvets",
          itemImageLink: 'https://images.pexels.com/photos/833046/pexels-photo-833046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          createdAt: "2023-06-29T13:52:50.755Z",
          updatedAt: "2023-06-29T13:52:50.755Z",
          __v: 0
      }
    ]

    const displayNavbar = () => {
      if (selectedNav === 'presleep') {
        return (
          <div className='text-gold'>
            <h2 className='mt-5'>PRE-SLEEP</h2>
            <p>Discover our Pre-Sleep Collection</p>
            <div className='d-flex justify-content-between'>
              <div>
                <Link to={`/shop/Pre-Sleep/filter/${presleepData[0]._id}`} className='btn-gold text-decoration-none' onClick={() => hideDropdownFunction()}>show all</Link>
              </div>
              <div>
                {/* <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" className="btn-black mx-1">all</button>
                  <button type="button" className="btn-black mx-1">towels</button>
                  <button type="button" className="btn-black mx-1">sleep perfume</button>
                </div> */}
              </div>
            </div>
            <div className='d-flex flex-wrap justify-content-between mt-5'>
            {presleepData.map((item) => {
                return (
                  <Link to={`/shop/Pre-Sleep/filter/${item._id}`} className='mb-2 navbar-category-item text-decoration-none text-gold' key={item.itemName} onClick={() => hideDropdownFunction()}>
                    <p className='mb-0'>{item.categoryName}</p>
                    <img src={placeholderImg} className='img-fluid my-2 shadow' />
                    {/* <h6>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h6> */}
                    {/* <div className='shop-category item-content d-flex justify-content-between'>
                      <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                      <p className='text-size-xsmall'>$25</p>
                    </div>
                    <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                      <p className='m-0 '>{item.itemName}</p>
                      <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                    </div> */}
                  </Link>
                )
            })}
            </div>
          </div>
        )
      } else if (selectedNav === 'sleep') {
        return (
          <div className='text-lblue'>
            <h2 className='mt-5'>SLEEP</h2>
            <p>Discover our Sleep Collection</p>
            <div className='d-flex justify-content-between'>
              <div>
                <Link to={`/shop/Sleep/filter/${sleepData[0]._id}`} className='btn-lblue text-decoration-none' onClick={() => hideDropdownFunction()}>show all</Link>
              </div>
              <div>
                {/* <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" className="btn-black mx-1">all</button>
                  <button type="button" className="btn-black mx-1">matressess</button>
                  <button type="button" className="btn-black mx-1">pillows</button>
                </div> */}
              </div>
            </div>
            <div className='d-flex flex-wrap justify-content-between mt-5'>
            {sleepData.map((item) => {
                return (
                  <Link to={`/shop/Sleep/filter/${item._id}`} className='mb-2 navbar-category-item text-decoration-none text-lblue' key={item._id} onClick={() => hideDropdownFunction()}>
                    <p className='mb-0'>{item.categoryName}</p>
                    <img src={placeholderImg} className='img-fluid my-2 shadow' />
                    {/* <h6>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h6> */}
                    {/* <div className='shop-category item-content d-flex justify-content-between'>
                      <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                      <p className='text-size-xsmall'>$25</p>
                    </div>
                    <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                      <p className='m-0 '>{item.itemName}</p>
                      <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                    </div> */}
                  </Link>
                )
            })}
            </div>
          </div>
        )
      } else if (selectedNav === 'postsleep') {
        return (
          <div className='text-lgray'>
            <h2 className='mt-5'>POST-SLEEP</h2>
            <p>Discover our Sleep Collection</p>
            <div className='d-flex justify-content-between'>
              <div>
                <Link to={`/shop/Post-Sleep/filter/all`} className='btn-lgray text-decoration-none' onClick={() => hideDropdownFunction()}>show all</Link>
              </div>
              <div>
                {/* <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" className="btn-black mx-1">all</button>
                  <button type="button" className="btn-black mx-1">matressess</button>
                  <button type="button" className="btn-black mx-1">pillows</button>
                </div> */}
              </div>
            </div>
          </div>
        )
      } else if (selectedNav === 'about') {
        return (
          <div className='text-gold'>
            <div className='education-navbar-container mt-5'>
              <Link to='/about' onClick={() => hideDropdownFunction()} className='hover-zoom shadow education-navbar-banner text-gold text-decoration-none mt-4 bg-gold d-flex justify-content-center align-items-center placeholder-image' style={{ backgroundImage: `url(${placeholderImg})` }}>
                <div className='text-center why-agoy'>
                  <h3 className='display-3'>WHY AGOY</h3>
                  <h4>ALL BENEFITS OF AGOY COLLECTION</h4>
                </div>
              </Link>

              <div className='education-navbar-container d-flex flex-wrap justify-content-between align-items-center mt-5'>
                <Link to='/about' onClick={() => hideDropdownFunction()} className='education-navbar-box mb-3'>
                  <img src={placeholderImg} className='img-fluid shadow' alt="Supplier Image"/>
                  <p className='text-gold mt-1'>ABOUT US</p>
                </Link>
                <Link to='/philosophy' onClick={() => hideDropdownFunction()} className='education-navbar-box mb-3'>
                  <img src={placeholderImg} className='img-fluid shadow' alt="Supplier Image"/>
                  <p className='text-gold mt-1'>PHILOSOPHY</p>
                </Link>
                <Link to="/education" onClick={() => hideDropdownFunction()} className='education-navbar-box mb-3'>
                  <img src={placeholderImg} className='img-fluid shadow' alt="Supplier Image"/>
                  <p className='text-gold mt-1'>ALPHABET</p>
                </Link>
                <div className='education-navbar-box mb-3' onClick={() => selectNavFunction('loyalty')}>
                  <img src={placeholderImg} className='img-fluid shadow' alt="Supplier Image"/>
                  <p className='text-gold mt-1'>LOYALTY</p>
                </div>
                <div className='education-navbar-box mb-3'>
                  <img src={placeholderImg} className='img-fluid shadow' alt="Supplier Image"/>
                  <p className='text-gold mt-1'>ACTIVITIES</p>
                </div>
              </div>
            </div>

            {/* <div className='desktop-view-section'>
              <hr className='mt-4' />

              <div className="philosophy-navbar-container d-flex text-white letter-spacing-1 mt-5">
                <div className='philosophy-image-holder'>
                  <img src='https://images.pexels.com/photos/15879044/pexels-photo-15879044/free-photo-of-bedroom-interior-design.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />
                </div>
                <div className='d-flex flex-column justify-content-center align-items-center bg-gold'>
                  <div className='width-500'>
                    <h3 className='display-5'>{missionVisionTitle[displayMV]}</h3>
                    <p className='width-500'>{missionVision[displayMV]}</p>
                
                    <div className='d-flex align-items-center mt-4'>
                      <button className='btn-white'>expand</button>
                      <div className='d-flex ml-3 mb-0'>Explore Journey<p className='tm-xxsmall'>TM</p>&nbsp; bed collection</div>
                    </div>
                    
                    <button className='btn-white'>
                      <MdOutlineNavigateBefore onClick={goToPreviousMV} /> 
                    </button>
                    <button className='btn-white'>
                      <MdOutlineNavigateNext onClick={goToNextMV} /> 
                    </button>
                  </div>
                </div>
              </div>

              <div className="about-navbar-container text-gold">
                <div className="upper-text-about bg-gray d-flex justify-content-center align-items-center">
                  <h4 className='OY-word mb-0 mt-5'>OY</h4> <p className='mb-0 mt-5'>it feels good.</p>
                </div>
                <div className="bottom-text-about bg-gray px-5">
                  <h4>Sleep is a love affair,
                  not a business partnership.</h4>

                  <p>Our brand belief is that humans should renew the deeply intimate relationship with their sleep in all its fullness. It is more a love affair than a business partnership. Savor and safeguard our realm of sleep, not just for its performance benefits but for the special way it allows us to connect with ourselves, practice mindfulness, enjoy the pre-sleep preparation anticipating a truly good night sleep.</p>

                  <button className='btn-gold mt-5'>learn more about our philosophy</button>
                </div>
                <div className="image-holder-about">
                  <img src="https://images.pexels.com/photos/4045535/pexels-photo-4045535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                </div>
              </div>
            </div>

            <hr className='my-5' />
            
            <div className='partner-navbar-banner text-gold mt-5 bg-gold d-flex justify-content-center align-items-center' style={{ backgroundImage: 'url("https://images.pexels.com/photos/12238319/pexels-photo-12238319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")' }}>
              <h3 className='display-3'>Partners</h3>
            </div>

            <div className='partner-navbar-container d-flex flex-wrap justify-content-between align-item-center mt-5'>
              <div className='partner-navbar-box mb-3'>
                <img src="https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className='img-fluid' alt="Supplier Image"/>
                <p className='text-gold mt-1'>OFFICIAL BED SUPPLIER</p>
              </div>
              <div className='partner-navbar-box mb-3'>
                <img src="https://images.pexels.com/photos/7018391/pexels-photo-7018391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className='img-fluid' alt="Supplier Image"/>
                <p className='text-gold mt-1'>DESIGN WITH AGOY</p>
              </div>
              <div className='partner-navbar-box mb-3'>
                <img src="https://images.pexels.com/photos/3682240/pexels-photo-3682240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className='img-fluid' alt="Supplier Image"/>
                <p className='text-gold mt-1'>DESIGNER COLLAB</p>
              </div>
            </div> */}
          </div>
        )
      } else if (selectedNav === 'search') {
        return (
          <div className='mt-5'>
            <input type='text' className='w-100 form-control search-input input-gold shadow-sm' placeholder='Type and press Enter to search.' onChange={e => setSearchValue(e.target.value)} onKeyDown={submitSearch} autoFocus />
            <div className='d-flex flex-wrap justify-content-between mt-5 item-box-holder'>
            {isFirstSearch && (
              searchLoading ?
                <div className="loading-content mx-auto height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <DotSpinner 
                    size={100}
                    speed={0.9} 
                    color="#D39E6C" 
                  />
                  <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
                </div>
                :
                searchResult &&
                  searchResult.length === 0 ? 
                  <h2 className="mont-bold text-gold text-center">No Item</h2>
                  :
                  searchResult.map((item) => {
                    return (
                      <Link to={`/shop/${item.groupId.groupName}/${item.urlId}`} className='mb-2 navbar-category-item text-decoration-none text-dim' key={item.model} onClick={() => hideDropdownFunction()}>
                        <p className='mb-0'>{item.model}</p>
                        <img src={item.imageUrl} className='img-fluid my-2 shadow' />
                        {/* <h6>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h6> */}
                        {/* <div className='shop-category item-content d-flex justify-content-between'>
                          <p className='text-size-xsmall'>BEST SELLER / BEST PRE-SLEEP EXPERIENCE</p>
                          <p className='text-size-xsmall'>$25</p>
                        </div>
                        <div className='shop-category item-content d-flex align-content-center justify-content-between'>
                          <p className='m-0 '>{item.itemName}</p>
                          <p className='mb-0 mt-1 text-size-xsmall'><a href='#'>Add to cart</a> | <a href='#'>shop now</a></p>
                        </div> */}
                      </Link>
                    )
                  })
              )
            }
            </div>
          </div>
        )
      } else if (selectedNav === 'loyalty') {
        return (
          <div className='text-gold'>
            <h2 className='mt-5'>Loyalty Program</h2>
            <hr />
            <div className='container mt-3 about-loyalty'>
              <div className='row'>
                <div className='col'>
                  <Link to="/" className='text-decoration-none text-gold'>Loyalty Program <AiOutlineRight /></Link>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    const signOut = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('firstName')
      localStorage.setItem('cartCount', 0)
      setFirstName('')
      hideDropdownFunction()
      window.location.replace(`${window.location.origin}/login`)
    }

    const submitSearch = async (e) => {
      if (e.key !== 'Enter')
        return

      setIsFirstSearch(true)

      setSearchLoading(true)
      setSearchResult([])

      await axios.get(`/api/product/search/${searchValue}`)
      .then(response => {
        setSearchResult(response.data)
      }).catch(err => console.log(err))
      
      setSearchLoading(false)
    }

    const openSearch = () => {
      setIsSearch(true)
      hideDropdownFunction()
    }

    const closeSearch = async () => {
      setIsSearch(false)
      setIsFirstSearch(false)
      setSearchResult([])
      setSearchValue('')
    }

    const displaySideNav = (type) => {
      if (type) {
        document.getElementById("mySidenav").style.width = "100vw";
        hideDropdownFunction()
      } else {
        document.getElementById("mySidenav").style.width = "0";
      }
    }

    const showNavContentFromSideNav = (selectedType) => {
      displaySideNav(false)
      selectNavFunction(selectedType)
    }

    useEffect(() => {
      const handleScroll = () => {
      // Check if the scroll position is at the top
      const isAtTop = window.scrollY === 0;
      setIsScrollAtTop(isAtTop);
      };

      // Add the event listener when the component mounts
      window.addEventListener('scroll', handleScroll);

      // Clean up the event listener when the component unmounts
      return () => {
      window.removeEventListener('scroll', handleScroll);
      };
  }, []);

    return (
      <>
        <div id="mySidenav" className="sidenav bg-gold text-white">
          <h2 className='d-flex justify-content-center'><img src={AGOYLogoWhite} alt='AGOY LOGO' width='200px' /></h2>
          <div className="closebtn" onClick={() => displaySideNav(false)}>&times;</div>
          <div className='mont-regular' onClick={() => showNavContentFromSideNav('about')}><AiOutlineMenu className='mr-3' />About</div>
          <Link to="/cart" onClick={() => displaySideNav(false)}><AiOutlineShoppingCart className='mr-3' />Cart {cartCount}</Link>
          {decodedToken ?
            <Link to={`/account/profile/${decodedToken.userId}`} onClick={() => displaySideNav(false)}><BiUserCircle className='mr-3' />{firstName}</Link>
            :
            <Link to='/login' onClick={() => displaySideNav(false)}><BiUserCircle className='mr-3' />Profile</Link>}
          <div className='mont-regular' onClick={() => showNavContentFromSideNav('search')}><BiSearch className='mr-3' />Search</div>
        </div>
        <nav className="position-sticky fixed-top text-gold shadow">
          <div className='d-flex align-items-center justify-content-between text-center mx-auto menu-holder'>
            <div className='d-flex justify-content-around align-items-center navbar-icons-holder'>
              <div className={`d-flex align-items-center justify-content-center menu pre-menu-hover nav-cat ${selectedNav === 'presleep' && 'active bg-gold text-white shadow'}`} onClick={() => selectNavFunction('presleep')}>
                <div className={`pre-line nav-logo-line ${selectedNav === 'presleep' && 'line-white nav-cat-hide'}`}></div>
                <div className={`icon-text ${selectedNav === 'presleep' ? 'nav-cat-show' : ''}`}>PRE-SLEEP</div>
              </div>
              <div className={`d-flex align-items-center justify-content-center menu s-menu-hover nav-cat ${selectedNav === 'sleep' && 'active bg-lblue border-0 text-white shadow'}`} onClick={() => selectNavFunction('sleep')}>
                <div className={`s-line nav-logo-line ${selectedNav === 'sleep' && 'line-white nav-cat-hide'}`}></div>
                <div className={`icon-text ${selectedNav === 'sleep' ? 'nav-cat-show' : 'text-lblue'}`}>SLEEP</div>
              </div>
              <div className={`d-flex align-items-center justify-content-center menu post-menu-hover nav-cat ${selectedNav === 'postsleep' && 'active bg-gray border-0 text-gold shadow'}`} onClick={() => selectNavFunction('postsleep')}>
                <div className={`pos-line nav-logo-line  ${selectedNav === 'postsleep' && 'line-white nav-cat-hide bg-gold'}`}></div>
                <div className={`icon-text ${selectedNav === 'postsleep' ? 'nav-cat-show' : 'text-lgray'}`}>POST-SLEEP</div>
              </div>
            </div>
            {/* {isScrollAtTop && <h2 className='m-0 agoy-logo' onClick={() => hideDropdownFunction()}><Link to="/" className="menu"><img src={AGOYLogo} alt='AGOY LOGO' width="100px" /></Link></h2>} */}
            <h2 className='m-0 agoy-logo' onClick={() => hideDropdownFunction()}><Link to="/" className="menu"><img src={AGOYLogo} className='website-logo' alt='AGOY LOGO' /></Link></h2>
            <div className='justify-content-between align-items-around navbar-icons-holder right-navigations'>
              {/* <div className={`menu menu-hover nav-logo ${selectedNav === 'about' && 'bg-gold text-white shadow'} ${selectedNav === 'loyalty' && 'bg-gold text-white shadow'}`} onClick={() => selectNavFunction('about')}><AiOutlineMenu /></div> */}
              <div
              className={`px-1 drop-down d-flex align-items-center justify-content-center menu menu-hover ${burgerLogoDropdown && 'active bg-gold text-white shadow'}`}
              // onClick={() => setUserSetting(prev => !prev)}
              onMouseEnter={() => setBurgerLogoDropdown(true)}
              onMouseLeave={() => setBurgerLogoDropdown(false)}
              >
                <div className="nav-logo pb-2 pr-1"><AiOutlineMenu /></div>
                {burgerLogoDropdown && <div className='position-absolute rounded-bottom shadow-lg bg-white user-setting width-200'>
                    <Link to="/about" className="dropdown-item py-2 text-gold" onClick={() => hideDropdownFunction()}>About Us</Link>
                    <Link to="/philosophy" className="dropdown-item py-2 text-gold" onClick={() => hideDropdownFunction()}>Philosophy</Link>
                    <Link to="/education" className="dropdown-item py-2 text-gold" onClick={() => hideDropdownFunction()}>Education Programmes</Link>
                    <div className="dropdown-item py-2 text-gold mont-regular" onClick={() => hideDropdownFunction()}>Loyalty</div>
                    <div className="dropdown-item py-2 text-gold mont-regular" onClick={() => hideDropdownFunction()}>Activities</div>
                </div>}
              </div>
              {/* <Link to="/shop" className="menu menu-hover nav-logo" onClick={() => hideDropdownFunction()}><BiShoppingBag /></Link> */}
              <Link to="/cart" className={`px-1 drop-down d-flex align-items-center justify-content-center menu menu-hover`} onClick={() => hideDropdownFunction()}>
                <div className="nav-logo pb-2 pr-1"><AiOutlineShoppingCart /></div>
                <div className='icon-text text-truncate width-10'>{cartCount}</div>
              </Link>
              {firstName === '' ? (<Link to='/login' className="menu menu-hover nav-logo d-flex align-items-center justify-content-center" onClick={() => hideDropdownFunction()}><BiUserCircle /></Link>) :
              (
                <>
                <div
                className={`drop-down d-flex align-items-center justify-content-center menu menu-hover ${userSetting && 'active bg-gold text-white shadow'}`}
                // onClick={() => setUserSetting(prev => !prev)}
                onMouseEnter={() => setUserSetting(true)}
                onMouseLeave={() => setUserSetting(false)}
                >
                  <div className="nav-logo pb-2 pr-1"><BiUserCircle /></div>
                  <div className='icon-text text-truncate width-10 name-text'>{firstName}</div>
                  {userSetting && <div className='position-absolute rounded-bottom shadow-lg bg-white user-setting'>
                    {decodedToken && <Link to={`/account/profile/${decodedToken.userId}`} className="dropdown-item py-2 text-gold" onClick={() => hideDropdownFunction()}>Profile</Link>}
                    <Link to="/cart" className="dropdown-item py-2 text-gold" onClick={() => hideDropdownFunction()}>Cart ({cartCount})</Link>
                    {/* <Link to="/process" className="dropdown-item py-2"></Link> */}
                    <div className="dropdown-item py-2 mont-regular text-gold" onClick={() => signOut()}>Sign out</div>
                  </div>}
                </div>
                </>
              )}
              <div className={`menu menu-hover nav-logo ${selectedNav === 'search' && 'bg-gold text-white shadow'}`} onClick={() => selectNavFunction('search')}><BiSearch /></div>
            </div>
            <div className='justify-content-center align-items-around navbar-icons-holder right-navigations-mobile'>
              <div className={`menu menu-hover nav-logo`} onClick={() => displaySideNav(true)}><AiOutlineMenu /></div>
            </div>
          </div>
        </nav>

        <div className={`header-dropdown-container pt-4 ${displayDropdown ? '' : 'slide-down'}`}>
          <div className='header-dropdown mx-auto'>
            {displayNavbar()}
          </div>
        </div>

      </>
    )
}

export default NavBar