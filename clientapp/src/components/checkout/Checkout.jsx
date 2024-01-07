import { useEffect, useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import StripeComponent from "../stripe-form/StripeComponent";
import { ItemPropsContext } from "../../context/itemPropsContext";
import axios from 'axios'

import { DotSpinner } from '@uiball/loaders'

import './checkout.css'

const Checkout = () => {
    const { token } = useContext(ItemPropsContext);

    const navigate = useNavigate()

    const [cartList, setCarList] = useState([])
    const [addressList, setAddressList] = useState([])
    const [walletBalance, setWalletBalance] = useState([])
    const [selectedAddress, setSelectedAddress] = useState('')
    const [displayedAddress, setDisplayedAddress] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cc')
    const [isLoading, setIsLoading] = useState(false)
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const [addressModal, setAddressModal] = useState(false)
    const [modalCC, setModalCC] = useState(false)
    const [modalTopUp, setModalTopUp] = useState(false)
    const [displayUseLoyaltyPoints, setDisplayUseLoyaltyPoints] = useState(false)
    const [insufficientWallet, setInsufficientWallet] = useState(false)
    const [topUpAmount, setTopUpAmount] = useState()
    const [totalPrice, setTotalPrice] = useState()
    const [totalProductPrice, setTotalProductPrice] = useState()
    const [pointsUsed, setPointsUsed] = useState(0)
    const [remainingPoints, setRemainingPoints] = useState(0)
    const [discountCode, setDiscountCode] = useState('')
    const [discountCodeError, setDiscountCodeError] = useState(false)
    const [discountData, setDiscountData] = useState()
    const [discountHandlerCompute, setDiscountHandlerCompute] = useState()

    // ALSO USED IN SUBMITTING NEW ADDRESS IF USER HAS NO ADDRESS
    const [guestAddress, setGuestAddress] = useState({})

    const getCartList = async () => {
      setIsLoading(true)

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      await axios.get('/api/cart/checkoutReady', config)
      .then(response => {
        setCarList(response.data.cartList)
        setAddressList(response.data.addressList)
        setWalletBalance(response.data.wallet.walletBalance)
        setRemainingPoints(response.data.wallet.loyaltyPoints)
        const total = response.data.cartList
          .reduce(function (prev, current) {
            return prev + +current.totalPriceAED;
          }, 0)
          .toFixed(2)
        setTotalPrice(total)
        setTotalProductPrice(total)

        setIsLoading(false)
      }).catch(err => console.log(err))
    };

    const getCartListGuest = async () => {
      setIsLoading(true)
      setPaymentMethod('cc')

      const guestCart = localStorage.getItem('guestCart')
      const data = JSON.parse(guestCart)

      await axios.post('/api/checkoutReadyGuest', data)
      .then(response => {
        setCarList(response.data.cartList)
        setAddressList(response.data.addressList)
        
        const total = response.data.cartList
          .reduce(function (prev, current) {
            return prev + +current.totalPriceAED;
          }, 0)
          .toFixed(2)
        setTotalPrice(total)
        setTotalProductPrice(total)

        setIsLoading(false)
      }).catch(err => console.log(err))
    };

    const addressChanged = (e) => {
      setSelectedAddress(e.target.value)
      setDisplayedAddress(addressList.find(q => q._id === e.target.value))
    }

    const checkoutSubmit = async () => {
      // setIsBtnLoading(true)
      setInsufficientWallet(false)

      if (paymentMethod === 'wallet' && walletBalance < totalPrice) {
        setIsBtnLoading(false)
        setInsufficientWallet(true)
        const needWallet = totalPrice - walletBalance
        setTopUpAmount(needWallet)
        return
      }

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const piHandler = sessionStorage.getItem('pi')
      let paymentIntent = ''

      if (piHandler)
        paymentIntent = piHandler

      const userCart = cartList.map(item => item._id)

      const data = {
        userCart: JSON.stringify(userCart),
        "addressId": selectedAddress,
        "paymentMethod": paymentMethod,
        paymentIntent,
        pointsUsed,
        discountCode
      }
  
      await axios.post('/api/cart/checkout', data, config)
      .then(response => {
        sessionStorage.setItem('cartToken', response.data.cartToken)
        navigate('/process')
      }).catch(err => {
        console.log(err)
        setIsBtnLoading(false)
      })
    }

    const checkoutSubmitGuest = async () => {
      setIsBtnLoading(true)
      
      const piHandler = sessionStorage.getItem('pi')

      const storageCart = localStorage.getItem('guestCart')
      const cartItems = JSON.parse(storageCart)

      const data = {
        "paymentIntent": piHandler,
        "addressData": guestAddress,
        "paymentMethod": paymentMethod,
        cartItems,
      }
  
      await axios.post('/api/checkoutCartGuest', data)
      .then(response => {
        sessionStorage.setItem('cartToken', response.data.cartToken)
        navigate('/process')
      }).catch(err => {
        console.log(err)
        setIsBtnLoading(false)
      })
    }

    const updateWallet = async (paymentIntentId) => {
      const config = {
        headers: {
          'x-access-token': token
        }
      }
  
      const data = {
        paymentIntentId
      }
  
      await axios.post('/api/wallet/topup', data, config)
      .then(response => {
        setWalletBalance(response.data.newWalletBalance)
        setModalTopUp(false)
        setInsufficientWallet(false)
        setTopUpAmount()
        setTotalPrice(0)
      }).catch(e => console.log(e))
    }

    const submitAddress = async () => {
      const config = {
        headers: {
          'x-access-token': token
        }
      }

      const data = guestAddress

      await axios.post('/api/address/add', data, config)
      .then(response => {
        setAddressList([response.data])
        cancelSubmitAddress()
      }).catch(err => console.log(err))
    }

    const cancelSubmitAddress = () => {
      setGuestAddress({})
      setAddressModal(false)
    }

    const setPaymentMethodFunction = (type) => {
      if (type === 'wallet') {
        let total = (totalProductPrice - walletBalance) - pointsUsed

        if (discountData) {
          (total -= discountHandlerCompute).toFixed(2)
        }

        setTotalPrice(total.toFixed(2))
      } else {
        let total = (cartList
        .reduce(function (prev, current) {
          return prev + +current.totalPriceAED;
        }, 0)
        .toFixed(2)) - pointsUsed

        if (discountData) {
          (total -= discountHandlerCompute).toFixed(2)
        }
        
        setTotalPrice(total.toFixed(2))
      }
      setPaymentMethod(type)
    }

    const setPointsUsedFunction = (value) => {
      let valueHandler = 0
      if (value > remainingPoints) {
        valueHandler = remainingPoints
      }
      else {
        valueHandler = value
      }

      let total = ((cartList
        .reduce(function (prev, current) {
          return prev + +current.totalPriceAED;
        }, 0)
        .toFixed(2)) - valueHandler)

      if (paymentMethod === 'wallet')
        (total -= walletBalance)

      if (discountData)
        (total -= discountHandlerCompute)

      setTotalPrice(total.toFixed(2))
      setPointsUsed(valueHandler)
    }

    const displayPoints = () => {
      setPointsUsed(0)
      setDisplayUseLoyaltyPoints(prev => !prev)

      if (displayUseLoyaltyPoints) {
        setPointsUsedFunction(0)
      }
    }

    const checkDiscountCode = async () => {
      if (discountCode) {
        await axios.post('/api/verifyDiscountCode', { discountCode })
        .then(response => {
          if (response.data.discount) {
            setDiscountData(response.data.discount)

            let totalHandler = 0

            if (response.data.discount.discountType === "Money") {
              setDiscountHandlerCompute(response.data.discount.discount)
              totalHandler = response.data.discount.discount
            } else if (response.data.discount.discountType === "Percentage") {
              let newPrice = (totalPrice * (response.data.discount.discount / 100)).toFixed(2)
              totalHandler = newPrice
              setDiscountHandlerCompute(newPrice)
            }

            let newTotalPrice = totalPrice - (totalHandler - pointsUsed).toFixed(2)
            if (paymentMethod === "wallet") {
              newTotalPrice -= walletBalance
            }
            setTotalPrice(newTotalPrice.toFixed(2))
          }
        }).catch(() => setDiscountCodeError(true))
      }
    }

    useEffect(() => {
      if (token) {
        getCartList()
      } else {
        getCartListGuest()
      }
    }, [])
    return (
      <div className=" py-3">
        {modalCC && <div className="modal text-white" style={{ background: "rgba(0, 0, 0, .5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="bg-gold p-5 shadow" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {token ?
              <StripeComponent submitHandler={checkoutSubmit} price={totalPrice} />
              :
              <StripeComponent submitHandler={checkoutSubmitGuest} price={totalPrice} />}
            {/* <button className="btn-white mt-1" onClick={() => setModalCC(false)}>cancel</button> */}
          </div>
        </div>}
        {modalTopUp && <div className="modal text-white" style={{ background: "rgba(0, 0, 0, .5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="bg-gold p-5 shadow" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <StripeComponent submitHandler={updateWallet} price={topUpAmount} />
            <button className="btn-white mt-1 py-2" onClick={() => setModalTopUp(false)}>cancel</button>
          </div>
        </div>}
        {addressModal && 
          <div className="modal text-white" style={{ background: "rgba(0, 0, 0, .5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="bg-gold p-5 shadow" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <h2 className="mb-3">Address</h2>
              <div className="form-address">
                {token && 
                  <div className="row mb-3">
                    <div className="col">
                      <label htmlFor="addressName" className="form-label">
                        Address Name:
                      </label>
                      <input
                        type="text"
                        className="form-control input-white"
                        id="addressName"
                        name="addressName"
                        value={guestAddress.addressName}
                        onChange={e => setGuestAddress(prevState => ({ ...prevState, addressName: e.target.value }))}
                      />
                    </div>  
                  </div>}
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="receiverName" className="form-label">
                      Receiver Name:
                    </label>
                    <input
                      type="text"
                      className="form-control input-white"
                      id="receiverName"
                      name="receiverName"
                      value={guestAddress.receiverName}
                      onChange={e => setGuestAddress(prevState => ({ ...prevState, receiverName: e.target.value }))}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="receiverNumber" className="form-label">
                      Receiver Mobile Number:
                    </label>
                    <input
                      type="number"
                      className="form-control input-white"
                      id="receiverNumber"
                      name="receiverNumber"
                      value={guestAddress.receiverNumber}
                      onChange={e => setGuestAddress(prevState => ({ ...prevState, receiverNumber: e.target.value }))}
                    />
                  </div>
                  {!token && <div className="col">
                    <label htmlFor="receiverNumber" className="form-label">
                      Receiver Email:
                    </label>
                    <input
                      type="email"
                      className="form-control input-white"
                      id="guestEmail"
                      name="guestEmail"
                      value={guestAddress.guestEmail}
                      onChange={e => setGuestAddress(prevState => ({ ...prevState, guestEmail: e.target.value }))}
                    />
                  </div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address Line:
                  </label>
                  <input
                    type="text"
                    className="form-control input-white"
                    id="address"
                    name="address"
                    value={guestAddress.addressLine}
                    onChange={e => setGuestAddress(prevState => ({ ...prevState, addressLine: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="landmark" className="form-label">
                    Landmark:
                  </label>
                  <input
                    type="text"
                    className="form-control input-white"
                    id="landmark"
                    name="landmark"
                    value={guestAddress.landmark}
                    onChange={e => setGuestAddress(prevState => ({ ...prevState, landmark: e.target.value }))}
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-sm">
                    <label htmlFor="city" className="form-label">
                      City:
                    </label>
                    <input
                      type="text"
                      className="form-control input-white"
                      id="city"
                      name="city"
                      value={guestAddress.city}
                      onChange={e => setGuestAddress(prevState => ({ ...prevState, city: e.target.value }))}
                    />
                  </div>
                  <div className="col-sm">
                    <label htmlFor="state" className="form-label">
                      State:
                    </label>
                    <input
                      type="text"
                      className="form-control input-white"
                      id="state"
                      name="state"
                      value={guestAddress.state}
                      onChange={e => setGuestAddress(prevState => ({ ...prevState, state: e.target.value }))}
                    />
                  </div>
                  <div className="col-sm">
                    <label htmlFor="zipcode" className="form-label">
                      Zip Code:
                    </label>
                    <input
                      type="number"
                      className="form-control input-white"
                      id="zipcode"
                      name="zipcode"
                      value={guestAddress.zipCode}
                      onChange={e => setGuestAddress(prevState => ({ ...prevState, zipCode: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-5">
                  {token ? 
                    <>
                    <button className="px-3 py-2 btn-white" onClick={() => submitAddress()}>ok</button>
                    <button className="px-3 py-2 btn-white" onClick={() => cancelSubmitAddress()}>cancel</button>
                    </>
                    :
                    <button className="px-3 py-2 btn-white" onClick={() => setAddressModal(false)}>ok</button>
                  }
                </div>
              </div>
            </div>
          </div>
        }
        <div className="container p-3">
          <Link to="/cart" className="btn-gold text-decoration-none px-3 py-2">Back to Cart</Link>
        </div>
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
          <div className="container p-3">
            <div className="table-responsive shadow">
              <table className="table cart-table text-center align-middle shadow">
                <thead className="mont-bold">
                  <tr>
                    <th className="image-column text-muted"></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Name</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Color</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Size</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Quantity</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Product Price</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Total</p></th>
                  </tr>
                </thead>
                <tbody className="mont-regular text-dim">
                  {cartList &&
                    cartList.map((item) => {
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
                            <p className="mb-0">
                              {item.quantity}
                            </p>
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
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            
            <div className="row mx-auto p-2 mb-3 bg-white text-dim shadow">
              <h2 className="mt-3 text-gold">Address</h2>
              <div className="row address-section">
                  {token ?
                    <>
                      {addressList.length === 0 ?
                        <div className="col">
                          <button className="btn-gold mb-3 ml-3" onClick={() => setAddressModal(true)}>set address</button>
                        </div>
                        :
                        <>
                        <div className="col-4">
                          <select className="width-300 mb-3 form-select input-black address-select mont-regular" onChange={e => addressChanged(e)} value={selectedAddress}>
                            <option className="bg-gold text-white" value="" selected hidden>--Select Address--</option>
                            {addressList.map(item => {
                              return (
                                <option key={item._id} className="" value={item._id}>{item.addressName}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="col">
                          {displayedAddress && <p className="mb-0 mt-2 address-display"><bold className="mr-3">{displayedAddress.receiverName} ({displayedAddress.receiverNumber})</bold> {displayedAddress.addressLine} ({displayedAddress.landmark}) {displayedAddress.city}, {displayedAddress.state}, {displayedAddress.zipCOde}</p>}
                          {!displayedAddress && <p className="mb-0 mt-2 address-display"><bold className="mr-3">--SELECT ADDRESS--</bold></p>}
                        </div>
                        </>
                      }
                    </>
                    :
                    <>
                    <div className="col-4">
                      <button className="btn-gold mb-3 ml-3" onClick={() => setAddressModal(true)}>set address</button>
                    </div>
                    <div className="col">
                      {(guestAddress.guestEmail &&
                        guestAddress.receiverName &&
                        guestAddress.receiverNumber &&
                        guestAddress.addressLine &&
                        guestAddress.landmark &&
                        guestAddress.city &&
                        guestAddress.state && 
                        guestAddress.zipCode) && 
                        <p className="mb-0 address-display"><bold className="mr-3">{guestAddress.receiverName} ({guestAddress.receiverNumber}) ({guestAddress.guestEmail})</bold> {guestAddress.addressLine} ({guestAddress.landmark}) {guestAddress.city}, {guestAddress.state}, {guestAddress.zipCode}</p>}
                    </div>
                    </>}
              </div>
            </div>
                
            <div className="row mx-auto p-2 mb-3 bg-white text-dim shadow">
              <div className="row payment-buttons">
                <div className="payment-buttons-col col-4"><h2 className="mt-3 text-gold">Payment Method</h2></div>
                <div className="payment-buttons-col col select-payment">
                  <select className="w-100 mt-3 mb-3 form-select input-gold address-select mont-regular payment-method-dropdown" onChange={e => setPaymentMethodFunction(e.target.value)} value={paymentMethod}>
                    <option className="bg-gold text-white" value="cc" selected>credit card/google pay/apple pay</option>
                    {token && <option className="bg-gold text-white" value="cod">cash on delivery</option>}
                    {token && <option className="bg-gold text-white" value="wallet">wallet</option>}
                  </select>
                  {insufficientWallet && 
                    <div className="d-flex align-items-center">
                      <p className="mb-0 text-danger">Insufficient wallet balance. Need: {topUpAmount} AED</p>
                      <button className="btn-gold mx-2" onClick={() => setModalTopUp(true)}>top up</button>
                    </div>}
                </div>
                <div className="col">
                  <div className="mt-3 mb-3 ">
                    <div className="row">
                      <div className="col">
                        <input className={`input-black w-100 ${discountCodeError ? 'border-danger' : ''}`} placeholder="Enter your discount code here." value={discountCode} onChange={e => setDiscountCode(e.target.value)} disabled={discountData} />
                      </div>
                      {!discountData &&
                        <div className="col-3 d-flex align-items-center">
                          <button className="btn-gold w-100 py-2" onClick={() => checkDiscountCode()}>Add</button>
                        </div>}
                    </div>
                    {discountCodeError && <p className="text-danger">Invalid discount code.</p>}
                    {discountData && <p>Discount code applied.</p>}
                  </div>
                </div>
              </div>
              <div className="row points-btn-con">
                <div className="col-4"></div>
                <div className="col points-input-btn d-flex align-items-center">
                  {token && <button className={`btn-gold mx-2 ${displayUseLoyaltyPoints ? 'bg-gold text-white' : ''}`} onClick={() => displayPoints()}>use points</button>}
                  {displayUseLoyaltyPoints &&
                    <div className="d-flex align-items-center">
                      <p className="mb-0">Loyalty Points: {remainingPoints}</p>
                      <input type="number" className="width-200 mb-3 input-black address-select mont-regular" onChange={e => setPointsUsedFunction(e.target.value)} value={pointsUsed} placeholder="0" />
                    </div>}
                </div>
              </div>
              <div className="checkout-price-parent text-center pb-3">
                <div className="checkout-price-1"><p>Payment Method:</p></div>
                <div className="checkout-price-2 mont-bold"><p>
                  {paymentMethod === 'cod' && 'Cash on Delivery'}
                  {paymentMethod === 'wallet' && 'Wallet'}
                  {paymentMethod === 'cc' && 'Credit Card'}
                  {paymentMethod === '' && '-Select Payment Method-'}
                </p></div>
                {paymentMethod === 'wallet' &&
                <>
                  <div className="checkout-price-3"><p>Wallet Balance:</p></div>
                  <div className="checkout-price-4"><p>{walletBalance}</p></div>
                </>}
                <div className="checkout-price-5"><p className="mb-0">Total Product Price:</p></div>
                <div className="checkout-price-6"><p className="mb-0">{totalProductPrice} AED</p></div>
                <div className="checkout-price-7"><p className="mb-0">Delivery Fee:</p></div>
                <div className="checkout-price-8">
                  <p className="mb-0">0</p>
                </div>
                {discountData &&
                <>
                  <div className="checkout-price-9"><p className="mb-0">Discount:</p></div>
                  <div className="checkout-price-10">
                    <p className="mb-0">-{
                      discountData.discountType === "Money" ? `${discountData.discount} AED` : `${discountData.discount}%`
                    }</p>
                  </div>
                </>}
                <div className="checkout-price-11"><p className="mb-0">Loyalty Points:</p></div>
                <div className="checkout-price-12">
                  <p className="mb-0">-{pointsUsed ? pointsUsed : 0}</p>
                </div>
                <div className="checkout-price-13"><p className="mb-0 h6">Total Price:</p></div>
                <div className="checkout-price-14 text-green">
                  <p className="mb-0 h6">{totalPrice < 0 ? 0 : totalPrice} AED</p>
                </div>
                {(paymentMethod && (selectedAddress || (guestAddress.receiverName && guestAddress.receiverNumber && guestAddress.addressLine && guestAddress.landmark && guestAddress.city && guestAddress.state && guestAddress.zipCode)))
                  && 
                  <div className="checkout-price-15">
                  {isBtnLoading ? 
                      <button className="btn-gold py-3 px-5 text-center btn-block mb-4" disabled>
                        <div className="snippet" data-title="dot-pulse">
                          <div className="stage">
                            <div className="dot-pulse"></div>
                          </div>
                        </div>
                      </button>
                    :
                      token ?
                        paymentMethod === 'cc' ? 
                          <button className="btn-gold py-2" onClick={() => setModalCC(true)}>continue</button>
                          :
                          <button className="btn-gold py-2" onClick={() => checkoutSubmit()}>continue</button>
                        :
                        <button className="btn-gold py-2" onClick={() => setModalCC(true)}>continue</button>}
                  </div>
                }
              </div>

            </div>
          </div>}
      </div>
    )
}

export default Checkout