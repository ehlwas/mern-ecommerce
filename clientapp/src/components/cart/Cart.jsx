import { useContext, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ItemPropsContext } from "../../context/itemPropsContext";
import { CART_STATE, cartListReducer } from "../../reducers/cartReducer";

import { DotSpinner } from '@uiball/loaders'

import './cart.css'

const Cart = () => {
  const { token, cartCount, setCartCount } = useContext(ItemPropsContext);

  const [noItem, setNoItem] = useState(false)

  const [cartListState, cartListDispatch] = useReducer(
    cartListReducer,
    CART_STATE
  );

  const getCartListGuest = async () => {
    const storageCart = localStorage.getItem('guestCart')
    const data = JSON.parse(storageCart)
    
    if (!storageCart)
    {
      setCartCount(0)
      setNoItem(true)
      return
    }

    if (data.length === 0)
    {
      setCartCount(0)
      setNoItem(true)
      return
    }

    localStorage.setItem('cartCount', data.length)
    setCartCount(data.length)
    cartListDispatch({ type: "FETCH_START" });

    await axios.post("/api/getGuestCart", data).then((response) => {
      let totalPrice = response.data
        .reduce(function (prev, current) {
          return prev + +current.totalPriceAED;
        }, 0)
        .toFixed(2);

      cartListDispatch({
        type: "FETCH_SUCCESS",
        payload: {
          list: response.data,
          count: response.data.length,
          totalPrice,
        },
      });
    });
  }

  const updateQuantityGuest = async (item, type) => {
    let quantity = 0;
    let storageCart = localStorage.getItem('guestCart')

    if (type === 'add') {
      quantity = item.quantity + 1
    } else if (type === 'minus') {
      quantity = item.quantity - 1
    }
    
    const newData = {
      sizeId: item.sizeData[0]._id,
      quantity: quantity,
      totalPriceAED: (item.sizeData[0].priceAED * quantity).toFixed(2),
      totalPriceUSD: (item.sizeData[0].priceUSD * quantity).toFixed(2),
    }

    let data = JSON.parse(storageCart)
    
    let newCart = await data.map(itemMap => {
      if (itemMap.sizeId === item.sizeData[0]._id) {
        return { ...itemMap, quantity: quantity }
      } else {
        return itemMap
      }
    })
    await localStorage.setItem('guestCart', JSON.stringify(newCart))

    await cartListDispatch({ type: "UPDATE_QUANTITY_GUEST", payload: newData})
  }

  const removeCartGuest = async (sizeId) => {
    const storageCart = localStorage.getItem('guestCart')
    const data = JSON.parse(storageCart)

    let newCart = data.filter(item => {
      if (item.sizeId !== sizeId)
        return item
    })
    await localStorage.setItem('guestCart', JSON.stringify(newCart))

    setCartCount(prev => prev - 1)

    cartListDispatch({ type: "REMOVE_ON_CART_GUEST", payload: sizeId })
  }

  const getCartList = async () => {
    cartListDispatch({ type: "FETCH_START" });

    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    await axios.get("/api/cart/userCart", config).then((response) => {
      let totalPrice = response.data
        .reduce(function (prev, current) {
          return prev + +current.totalPriceAED;
        }, 0)
        .toFixed(2);

      cartListDispatch({
        type: "FETCH_SUCCESS",
        payload: {
          list: response.data,
          count: response.data.length,
          totalPrice,
        },
      });
      
      localStorage.setItem('cartCount', response.data.length)
    });
  };

  const updateQuantity = async (item, type) => {
    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    let quantity = 0;

    if (type === 'add') {
      quantity = item.quantity + 1
    } else if (type === 'minus') {
      quantity = item.quantity - 1
    }
    
    const data = {
      "id": item._id,
      "quantity": quantity
    }

    console.log(data)

    await axios.post('/api/cart/updateQuantity', data, config)
    .then((response) => {
      cartListDispatch({ type: "UPDATE_QUANTITY", payload: response.data})
    })
    .finally(async () => {
    })
    .catch(err => console.log(err))
  }

  const removeCart = async (id) => {
    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    await axios.delete(`/api/cart/remove/${id}`, config)
    .then(() => {
      cartListDispatch({ type: "REMOVE_ON_CART", payload: id })
      const getCartCount = localStorage.getItem('cartCount')
      const newCount = parseInt(getCartCount) - 1
      localStorage.setItem('cartCount', newCount)
      setCartCount(newCount)
    })
  }

  useEffect(() => {
    sessionStorage.removeItem('cartToken')
    if (token)
      getCartList();
    else 
      getCartListGuest();
  }, []);

  return (
    <section className="py-3 cart-container">
      {!token && <div className="text-end">
      <Link to='/reference-tracker' className="btn-gold text-decoration-none py-2 px-3 mx-5">Track Reference Number</Link>
      </div>}
      {noItem ?   
        <h2 className="mont-bold text-gold text-center">No Item</h2>
        :
        cartListState.loading ? 
        <div className="loading-content mx-auto height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <DotSpinner 
            size={100}
            speed={0.9} 
            color="#D39E6C" 
          />
          <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
        </div> 
        :
        <div className="container text-gold">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col">
              <p>
                <span className="h2 text-heading">Shopping Cart </span>
                <span className="h4 text-subheading">
                  ({cartCount} item in your cart)
                </span>
              </p>

              {/* <div className="table-responsive">
                <table className="table cart-table text-center align-middle">
                  <thead className="mont-bold">
                    <tr>
                      <th className="image-column text-muted"></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Name</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Color</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Size</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Quantity</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Product Price</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Total</p></th>
                      <th className="action-column text-muted"></th>
                    </tr>
                  </thead>
                  <tbody className="mont-regular">
                    {cartListState.cartList &&
                      cartListState.cartList.map((item) => {
                        return (
                          <tr key={item._id}>
                            <td>
                              <img
                                src={item.productData[0].imageUrl}
                                className="img-fluid"
                                alt="Generic placeholder image"
                              />
                            </td>
                            <td>
                              <p className="mb-0">
                                {item.productData[0].model}
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                {item.productData[0].color}
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                {item.sizeData[0].size}
                              </p>
                            </td>
                            <td>
                              {token ? 
                                <>
                                  <button className="btn-gold mr-3" onClick={() => updateQuantity(item, 'minus')} disabled={item.quantity <= 1}>-</button>{item.quantity}<button className="btn-gold ml-3" onClick={() => updateQuantity(item, 'add')} disabled={item.quantity >= 99}>+</button>
                                </>
                                :
                                <>
                                  <button className="btn-gold mr-3" onClick={() => updateQuantityGuest(item, 'minus')} disabled={item.quantity <= 1}>-</button>{item.quantity}<button className="btn-gold ml-3" onClick={() => updateQuantityGuest(item, 'add')} disabled={item.quantity >= 99}>+</button>
                                </>}
                            </td>
                            <td>
                              <p className="mb-0">
                                {item.sizeData[0].priceAED} AED
                              </p>
                            </td>
                            <td>
                              <p className="mb-0">
                                {item.totalPriceAED} AED
                              </p>
                            </td>
                            <td>
                              {token ?
                              <button className="btn-gold" onClick={() => removeCart(item._id)}>X</button>
                              :
                              <button className="btn-gold" onClick={() => removeCartGuest(item.sizeData[0]._id)}>X</button>}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div> */}

              {cartListState.cartList &&
              cartListState.cartList.map((item) => {
                return (
                  <div key={item._id} className="card mb-4 text-dim shadow">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md">
                          <img
                            src={item.productData[0].imageUrl}
                            className="img-fluid"
                            alt="Generic placeholder image"
                          />
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted">Name</p>
                            <p className="mb-0 text-truncate cart-detail">
                              {item.productData[0].model}
                            </p>
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted ">Color</p>
                            <p className="mb-0 cart-detail">
                              {item.productData[0].color}
                            </p>
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted">Size</p>
                            <p className="mb-0 cart-detail">
                             
                              {item.sizeData[0].size}
                            </p>
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted">
                              Quantity
                            </p>
                            <p className="mb-0 cart-detail" style= {{width: '100px'}}>
                              {token ?
                                <>
                                  <button className="btn-gold" onClick={() => updateQuantity(item, 'minus')}>-</button><span className="mx-1">{item.quantity}</span><button className="btn-gold" onClick={() => updateQuantity(item, 'add')}>+</button>
                                </>
                                :
                                <>
                                  <button className="btn-gold" onClick={() => updateQuantityGuest(item, 'minus')}>-</button><span className="mx-1">{item.quantity}</span><button className="btn-gold" onClick={() => updateQuantityGuest(item, 'add')}>+</button>
                                </>
                              }
                            </p>
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted"  style= {{width: '80px'}}>Price</p>
                            <p className="mb-0 cart-detail">
                              {item.sizeData[0].priceAED} AED
                            </p>
                          </div>
                        </div>
                        <div className="col-md justify-content-center cart-content">
                          <div>
                            <p className="text-muted"  style= {{width: '80px'}}>Total</p>
                            <p className="mb-0 cart-detail">
                              {item.totalPriceAED} AED
                            </p>
                          </div>
                        </div>
                        <div className="col-sm-1 d-flex justify-content-center">
                        
                          {token ?
                            <button className="btn-gold" onClick={() => removeCart(item._id)}>X</button>
                            :
                            <button className="btn-gold" onClick={() => removeCartGuest(item.sizeData[0]._id)}>X</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="card mb-5 shadow">
                <div className="card-body p-4">
                  <div className="float-end">
                    <p className="mb-0 me-5 d-flex align-items-center">
                      <span className="me-2 text-dim h6 mb-0">Order total:</span>{" "}
                      <span className="text-green h6 mb-0">
                        { cartListState.cartList
                        .reduce(function (prev, current) {
                          return prev + +current.totalPriceAED;
                        }, 0)
                        .toFixed(2) } AED
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                {cartListState.cartList.length > 0 &&
                <Link to="/checkout" type="button" className="btn-gold text-decoration-none p-3">
                  Continue to Pay
                </Link>}
              </div>
            </div>
          </div>
        </div>}
    </section>
  );
};

export default Cart;
