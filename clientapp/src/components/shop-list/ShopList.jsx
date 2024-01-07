import { useEffect, useReducer, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { DotSpinner } from '@uiball/loaders'

import { FILTER_STATE, shopListFilterReducer } from "../../reducers/shopListFilterReducer";
import { PRODUCT_STATE, productListReducer } from "../../reducers/productListReducer";
import { AiFillCheckCircle } from 'react-icons/ai'
import { BsChevronBarDown } from 'react-icons/bs'

import ShopListBox from "./ShopListBox";

import './shop-list.css';
import SLPreSleepContent from "./SLPreSleepContent";
import SLSleepContent from "./SLSleepContent";
import SLPostSleepContent from "./SLPostSleepContent";

const ShopList = () => {
  const { group, category } = useParams()
  const navigate = useNavigate()

  const [filterState, filterDispatch] = useReducer(shopListFilterReducer, FILTER_STATE)
  const [productListState, productDispatch] = useReducer(productListReducer, PRODUCT_STATE)
  const [searchValue, setSearchValue] = useState('')
  const [addedToCartNotification, setAddedToCartNotification] = useState(false)
  const [displayShowMore, setDisplayShowMore] = useState(true)
  
  const showNotification = () => {
    setAddedToCartNotification(true)

    setTimeout(() => {
      setAddedToCartNotification(false)
    }, 5000)
  }

  const getFilter = async () => {
    await setSearchValue('')
    filterDispatch({ type: "FETCH_START" })
    try {
      const response = await axios.get(`/api/category/${group}`)
      filterDispatch({ type: "FETCH_SUCCESS", payload: response.data })
      await getProducts(category)
    } catch (error) {
      filterDispatch({ type: "FETCH_ERROR" })
      console.log(error)
    }
  }

  const getProducts = async (id) => {
    productDispatch({ type: "FETCH_START" });

    let url = '';
    
    if (id === 'all') {
      url = `/api/product/${group}`;
    } else {
      url = `/api/product/${id}`;
    }



    const data = {
      searchValue
    }

    try {
      const response = await axios.post(url, data);
      productDispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error) {
      productDispatch({ type: "FETCH_ERROR" });
      console.log(error);
    }
  };

  const submitSearch = async (e) => {
    if (e.key !== 'Enter')
    return

    await getProducts(category)
  }

  const setDisplayContent = () => {
    if (group === "Pre-Sleep") {
      return <SLPreSleepContent />
    } else if (group === "Sleep") {
      return <SLSleepContent />
    } else if (group === "Post-Sleep") {
      return <SLPostSleepContent />
    }
  }

  useEffect(() => {
    getFilter()
  }, [group])

  const handleFilterClick = async (categoryId) => {
    if (category === categoryId) return

    await navigate(`/shop/${group}/filter/${categoryId}`)
    await getProducts(categoryId);
  };

  return (
    <div>
      {addedToCartNotification && <div className={`text-dim bg-white height-60 py-3 px-3 position-fixed added-to-cart`}>
        <div className='d-flex align-items-center gap-1'>
          <AiFillCheckCircle className='' /> 
          <p className='mb-0'>Added to Cart</p>
        </div>
        <Link to="/cart" className='btn-black text-decoration-none mt-1'>Go to Cart</Link>
      </div>}

      {group === 'Pre-Sleep' && <div className="d-flex justify-content-center align-items-center text-center pt-3 text-gold">
        <div className={`pre-line presleep product-line`}></div>
        <h2 className="text-uppercase">{group} EXPERIENCE</h2>
      </div>}
      {group === 'Sleep' && <div className="d-flex justify-content-center align-items-center text-center pt-3 text-lblue">
        <div className={`s-line sleep product-line bg-lblue`}></div>
        <h2 className="text-uppercase">{group} EXPERIENCE</h2>
      </div>}
      {group === 'Post-Sleep' && <div className="d-flex justify-content-center align-items-center text-center pt-3 text-lgray">
        <div className={`pos-line sleep product-line bg-lgray`}></div>
        <h2 className="text-uppercase">{group} EXPERIENCE</h2>
      </div>}
      {filterState.loading ? (
        <div className="loading-content mx-auto width-500 height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <DotSpinner 
            size={100}
            speed={0.9} 
            color="#D39E6C" 
          />
          <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
        </div> 
        ) : (
        <div className="my-3">
          {group === 'Pre-Sleep' &&
            <div className="filter-container py-1 d-flex flex-wrap justify-content-around align-content-center mx-auto">
              <input type="text" className="input-black mont-regular shoplist-dropdown-filter-black" placeholder="Press Enter to search..." value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyDown={submitSearch} />
              {filterState.filterList &&
                <select className="input-black mont-regular shoplist-dropdown-filter-black" onChange={e => handleFilterClick(e.target.value)}>
                  <option className={`filter-name m-1 px-3 py-1 ${category === 'all' ? 'bg-dim text-white' : 'text-dim'}`} value='all' selected={category === 'all'}>All</option>
                {filterState.filterList.map(item => {
                  return (
                    <option key={item._id} className={`filter-name m-1 px-3 py-1 ${category === item._id ? 'bg-gold text-white' : ''}`} value={item._id} selected={category === item._id}>{item.categoryName}</option>
                  )
                })}
                </select>
              }
            </div>}
          {group === 'Sleep' &&
            <div className="filter-container py-1 d-flex flex-wrap justify-content-around align-content-center mx-auto">
              <input type="text" className="input-black mont-regular shoplist-dropdown-filter-black" placeholder="Press Enter to search..." value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyDown={submitSearch} />
              {filterState.filterList &&
                <select className="input-black mont-regular shoplist-dropdown-filter-black" onChange={e => handleFilterClick(e.target.value)}>
                  <option className={`filter-name m-1 px-3 py-1 ${category === 'all' ? 'bg-dim text-white' : ''}`} value='all' selected={category === 'all'}>All</option>
                {filterState.filterList.map(item => {
                  return (
                    <option key={item._id} className={`filter-name m-1 px-3 py-1 ${category === item._id ? 'bg-lblue text-white' : ''}`} value={item._id} selected={category === item._id}>{item.categoryName}</option>
                  )
                })}
                </select>
              }
            </div>}
          {group === 'Post-Sleep' &&
            <div className="filter-container py-1 d-flex flex-wrap justify-content-around align-content-center mx-auto">
              <input type="text" className="input-black mont-regular shoplist-dropdown-filter-black" placeholder="Press Enter to search..." value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyDown={submitSearch} />
              {filterState.filterList &&
                <select className="input-black mont-regular shoplist-dropdown-filter-black" onChange={e => handleFilterClick(e.target.value)}>
                  <option className={`filter-name m-1 px-3 py-1 ${category === 'all' ? 'bg-dim text-white' : ''}`} value='all' selected={category === 'all'}>All</option>
                {filterState.filterList.map(item => {
                  return (
                    <option key={item._id} className={`filter-name m-1 px-3 py-1 ${category === item._id ? 'bg-lblue text-white' : ''}`} value={item._id} selected={category === item._id}>{item.categoryName}</option>
                  )
                })}
                </select>
              }
            </div>}
          <div className="item-list-container width-90vw mt-3 mx-auto d-flex flex-wrap justify-content-center gap-3">
            {productListState.loading ?
              <div className="loading-content mx-auto width-500 height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <DotSpinner 
                  size={100}
                  speed={0.9} 
                  color="#D39E6C" 
                />
                <p className='text-dim' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
              </div> 
              :
              productListState.productList &&
                productListState.productList.length === 0 ? 
                  <h2 className="mont-bold text-dim">No item</h2>
                  :
                  (
                    productListState.productList.map((item) => (
                      <ShopListBox key={item._id} item={item} group={group} showNotification={showNotification} />
                    ))
                  )
              }
          </div>
        </div>)
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
              {setDisplayContent()}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ShopList;
