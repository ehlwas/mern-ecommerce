import { useContext, useEffect, useReducer, useState } from "react";
import { ItemPropsContext } from "../../context/itemPropsContext";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { CgDanger } from 'react-icons/cg'

import { DotSpinner } from '@uiball/loaders'

import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs'
import { PROFILE_STATE, profileReducer } from "../../reducers/profileReducer";

import StripeComponent from "../stripe-form/StripeComponent";

const ProfileUserInfo = () => {
  const { token, setFirstName } = useContext(ItemPropsContext)

  const [profileState, profileDispatch] = useReducer(
    profileReducer,
    PROFILE_STATE
  );

  const { userId } = useParams()

  // const [userDetails, setUserDetails] = useState({
  //   firstName: "",
  //   lastName: "",
  //   mobileNumber: "",
  //   email: "",
  //   birthday: "",
  //   gender: "",
  //   addressList: []
  // })
  const [addressHandler, setAddressHandler] = useState({
    addressName: "",
    receiverName: "",
    receiverNumber: "",
    addressLine: "",
    city: "",
    state: "",
    zipCode: ""
  })

  const [edit, setEdit] = useState(false)
  const [showAddress, setShowAddress] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpModal, setTopUpModal] = useState(false);
  const [topUpPrice, setTopUpPrice] = useState()
  const [addressModal, setAddressModal] = useState(false)
  const [isNewAddress, setIsNewAddress] = useState(true)
  const [updateUserState, setUpdateUserState] = useState({})
  const [userUpdated, setUserUpdated] = useState(false)
  // const [userErrorUpdate, setUserErrorUpdate] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [oldPassword, setOldPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  const [confirmNewPassword, setConfirmNewPassword] = useState()
  const [btnLoading, setBtnLoading] = useState(false)
  const [passwordWrong, setPasswordWrong] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [newPassWrong, setNewPassWrong] = useState(false)
  const [insufficientTopUp, setInsufficientTopUp] = useState(false)


  const getInfo = async () => {
    profileDispatch({ type: 'FETCH_START' })
    const config = {
      headers: {
        'x-access-token': token
      }
    }

    await axios.get(`/api/user/${userId}`, config)
      .then(response => {
        profileDispatch({ type: 'FETCH_SUCCESS',
          payload: { 
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            mobileNumber: response.data.mobileNumber,
            birthday: response.data.birthday.toString(),
            gender: response.data.gender,
            addressList: response.data.addressList,
            emailVerified: response.data.emailVerified,
            wallet: response.data.wallet
          }
        })
      }).catch(err => console.log(err))
  }

  const submitProfileData = async (e) => {
    e.preventDefault()
    setUserUpdated(false)
    setBtnLoading(true)

    const config = {
      headers: {
        'x-access-token': token
      }
    }

    const data = updateUserState

    await axios.post(`/api/user/${userId}`, data, config)
    .then(response => {
      profileDispatch({ type: 'EDIT_PROFILE', firstName: response.data.firstName })
      profileDispatch({ type: 'EDIT_PROFILE', lastName: response.data.lastName })
      profileDispatch({ type: 'EDIT_PROFILE', email: response.data.email })
      profileDispatch({ type: 'EDIT_PROFILE', mobileNumber: response.data.mobileNumber })
      profileDispatch({ type: 'EDIT_PROFILE', gender: response.data.gender })
      profileDispatch({ type: 'EDIT_PROFILE', birthday: response.data.birthday })
      setUserUpdated(true)
      localStorage.setItem('firstName', response.data.firstName)
      setFirstName(response.data.firstName)
    })
    .catch(err => console.log(err))

    setBtnLoading(false)
  }

  const postAddress = async () => {
    setBtnLoading(true)
    const config = {
      headers: {
        'x-access-token': token
      }
    }

    let url = ''

    if (isNewAddress === true) {
      url = '/api/address/add'
    }
    else {
      url = `/api/address/${addressHandler._id}`
    }

    const data = addressHandler

    await axios.post(url, data, config)
    .then(response => {
      if (isNewAddress === true) {
        let arrayData = profileState.profileData.addressList
        arrayData.unshift(response.data)
        profileDispatch({ type: 'ADD_ADDRESS', payload: arrayData })
      }
      else {
        profileDispatch({ type: 'UPDATE_ADDRESS', payload: response.data })
      }
      setAddressModal(false)
    }).catch(err => console.log(err))

    setBtnLoading(false)
  }

  const removeAddress = async (id) => {
    const config = {
      headers: {
        'x-access-token': token
      }
    }
    const data = {
      'id': id
    }
    await axios.post(`/api/address/remove/${id}`, data, config)
    .then(response => {
      profileDispatch({ type: 'REMOVE_ADDRESS', payload: id })
      console.log(response.data)
    })
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    setPasswordWrong(false)
    setPasswordError(false)
    setNewPassWrong(false)
    if ((!newPassword || !confirmNewPassword || !oldPassword)) {
      return
    }
    if (newPassword !== confirmNewPassword) {
      setNewPassWrong(true)
      return
    }

    const config = {
      headers: {
        'x-access-token': token
      }
    }

    const data = {
      oldPassword,
      newPassword
    }

    await axios.post('/api/user/u/pw', data, config)
    .then(response => {
      setChangePassword(false)
    }).catch((err) => {
      const status = err.response.status
      if (status === 401) {
        setPasswordWrong(true)
      }
      else {
        setPasswordError(true)
      }
    })
  }

  const upperFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const closeModal = (e) => {
    e.stopPropagation()
    setAddressModal(false)
  }
  const openModal = (item) => {
    if (item === null)
    {
      setAddressHandler({
        addressName: "",
        receiverName: "",
        receiverNumber: "",
        addressLine: "",
        city: "",
        state: "",
        zipCode: ""
      })
      setIsNewAddress(true)
    }
    else
    {
      setAddressHandler(item)
      setIsNewAddress(false)
    }
    setAddressModal(true)
  }

  const editProfile = () => {
    setEdit(prev => !prev)
    setUserUpdated(false)
    setUpdateUserState({
      firstName: profileState.profileData.firstName,
      lastName: profileState.profileData.lastName,
      email: profileState.profileData.email,
      mobileNumber: profileState.profileData.mobileNumber,
      gender: profileState.profileData.gender,
      birthday: profileState.profileData.birthday
    })
  }

  const displayWallet = () => {
    setShowWallet(prev => !prev)
    setTopUpPrice()
    setShowTopUp(false)
  }

  const displayTopUp = () => {
    setShowTopUp(prev => !prev)
    setTopUpPrice()
  }

  const displayTopUpModal = () => {
    setInsufficientTopUp(false)
    
    if (!topUpPrice || topUpPrice < 50) {
      setInsufficientTopUp(true)
      return
    }

    setTopUpModal(true)
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
      console.log(response.data)
      setTopUpModal(false)
      displayTopUp()
      profileDispatch({ type: 'EDIT_PROFILE', wallet: response.data.newWalletBalance })
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    getInfo()
  }, [])
  return (
    <>
    {profileState.loading ?
      <div className="loading-content mx-auto height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <DotSpinner 
            size={100}
            speed={0.9} 
            color="#D39E6C" 
          />
        <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
      </div> 
      :
      <div className="container my-3 profile-container text-gold">
        {topUpModal && <div className="modal text-white" style={{ background: "rgba(0, 0, 0, .5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="bg-gold shadow p-5" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <StripeComponent submitHandler={updateWallet} price={topUpPrice} />
            <button className="btn-white mt-1 py-2" onClick={() => setTopUpModal(false)}>cancel</button>
          </div>
        </div>}
        {addressModal && 
          <div className="modal text-white" style={{ background: "rgba(0, 0, 0, .5)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="bg-gold shadow width-700 p-5" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <h2 className="mb-3">Address</h2>
              <div onSubmit={postAddress} className="form-address">
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
                      value={addressHandler.addressName}
                      onChange={e => setAddressHandler(prevState => ({ ...prevState, addressName: e.target.value }))}
                      disabled={btnLoading}
                    />
                  </div>  
                </div>
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
                      value={addressHandler.receiverName}
                      onChange={e => setAddressHandler(prevState => ({ ...prevState, receiverName: e.target.value }))}
                      disabled={btnLoading}
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
                      value={addressHandler.receiverNumber}
                      onChange={e => setAddressHandler(prevState => ({ ...prevState, receiverNumber: e.target.value }))}
                      disabled={btnLoading}
                    />
                  </div>
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
                    value={addressHandler.addressLine}
                    onChange={e => setAddressHandler(prevState => ({ ...prevState, addressLine: e.target.value }))}
                    disabled={btnLoading}
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
                    value={addressHandler.landmark}
                    onChange={e => setAddressHandler(prevState => ({ ...prevState, landmark: e.target.value }))}
                    disabled={btnLoading}
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
                      value={addressHandler.city}
                      onChange={e => setAddressHandler(prevState => ({ ...prevState, city: e.target.value }))}
                      disabled={btnLoading}
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
                      value={addressHandler.state}
                      onChange={e => setAddressHandler(prevState => ({ ...prevState, state: e.target.value }))}
                      disabled={btnLoading}
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
                      value={addressHandler.zipCode}
                      onChange={e => setAddressHandler(prevState => ({ ...prevState, zipCode: e.target.value }))}
                      disabled={btnLoading}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-5">
                  {btnLoading ? 
                    <button className="btn-white py-3 px-5 text-center btn-block" disabled>
                      <div className="snippet" data-title="dot-pulse">
                        <div className="stage">
                          <div className="dot-pulse text-white"></div>
                        </div>
                      </div>
                    </button>
                    :
                    <button className="px-3 py-2 btn-white" onClick={() => postAddress()}>submit</button>
                  }
                  {!btnLoading && <button className="px-3 py-2 btn-white" onClick={(e) => closeModal(e)}>cancel</button>}
                </div>
              </div>
            </div>
          </div>
        }
        <div className="row bg-white shadow text-dim">
          <div className="col">
            <div className="form mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="text-gold">My Profile</h2>
                  <p className="mb-0">Manage and protect your account</p>
                </div>
                <div>
                  <button className="btn-gold" onClick={() => editProfile()}>{edit ? 'cancel' : 'edit'}</button>
                </div>
              </div>
              <hr />
              <form className="mx-auto form-profile" onSubmit={submitProfileData}>
                <div className="row mb-3">
                  <div className="col-sm firstname">
                    <label htmlFor="firstName" className="form-label">
                      First Name:
                    </label>
                    {edit ? (
                      <input
                        type="text"
                        className="form-control input-gold mont-bold"
                        id="firstName"
                        name="firstName"
                        value={updateUserState.firstName}
                        onChange={(e) => setUpdateUserState(prev => ({...prev, firstName: e.target.value }))}
                        disabled={btnLoading}
                      />
                    ) : (
                      <h6 className="mont-bold letter-spacing-1 font-weight-bold text-gold">{profileState.profileData.firstName}</h6>
                    )}
                  </div>
                  <div className="col-sm">
                    <label htmlFor="lastName" className="form-label">
                      Last Name:
                    </label>
                    {edit ? (
                      <input
                        type="text"
                        className="form-control input-gold mont-bold"
                        id="lastName"
                        name="lastName"
                        value={updateUserState.lastName}
                        onChange={(e) => setUpdateUserState(prev => ({...prev, lastName: e.target.value }))}
                        disabled={btnLoading}
                      />
                    ) : (
                      <h6 className="mont-bold letter-spacing-1 font-weight-bold text-gold">{profileState.profileData.lastName}</h6>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  {edit ? (
                    <input
                      type="email"
                      className="form-control input-gold mont-bold"
                      id="email"
                      name="email"
                      value={updateUserState.email}
                      onChange={(e) => setUpdateUserState(prev => ({...prev, email: e.target.value }))}
                      disabled={btnLoading}
                    />
                  ) : (
                    <div className="d-flex align-items-center gap-1">
                      <h6 className="mont-bold letter-spacing-1 font-weight-bold text-gold">{profileState.profileData.email}</h6>
                      {profileState.profileData.emailVerified ?
                        <p className="text-lblue"><AiOutlineCheckCircle /></p>
                        :
                        <p><Link to='/email-verification' className="btn-gold"><CgDanger /></Link></p>}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Mobile Number:
                  </label>
                  {edit ? (
                    <input
                      type="tel"
                      className="form-control input-gold mont-bold"
                      id="phone"
                      name="phone"
                      value={updateUserState.mobileNumber}
                      onChange={(e) => setUpdateUserState(prev => ({...prev, mobileNumber: e.target.value }))}
                      disabled={btnLoading}
                    />
                    ) : (
                    <h6 className="mont-bold letter-spacing-1 font-weight-bold text-gold">{profileState.profileData.mobileNumber}</h6>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-sm">
                    <label htmlFor="gender" className="form-label">
                      Gender:
                    </label>
                    {edit ? (
                      <select
                        className="form-select input-gold mont-bold"
                        id="gender"
                        name="gender"
                        value={updateUserState.gender}
                        onChange={(e) => setUpdateUserState(prev => ({...prev, gender: e.target.value }))}
                        disabled={btnLoading}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <>
                      {profileState.profileData.gender && <h6 className="mont-bold letter-spacing-1 font-weight-bold text-gold">{upperFirstLetter(profileState.profileData.gender)}</h6>}
                      </>
                    )}
                  </div>
                  <div className="col-sm">
                    <label htmlFor="birthday" className="form-label">
                      Birthdate:
                    </label>
                    {edit ? (
                      <input
                        type="date"
                        className="form-control input-gold mont-bold"
                        id="birthday"
                        name="birthday"
                        value={updateUserState.birthday}
                        onChange={(e) => setUpdateUserState(prev => ({...prev, birthday: e.target.value }))}
                        disabled={btnLoading}
                      />
                    ) : (
                      <h6 className="mont-bold letter-spacing-1 font-weight-bold text-gold">{profileState.profileData.birthday}</h6>
                    )}
                  </div>
                </div>
                {userUpdated && <p>Update success!</p>}
                <div>
                  {edit && 
                    (
                      btnLoading ? 
                        <button className="btn-gold py-3 px-5 mb-3 text-center btn-block" disabled>
                          <div className="snippet" data-title="dot-pulse">
                            <div className="stage">
                              <div className="dot-pulse"></div>
                            </div>
                          </div>
                        </button>
                        :
                        <button type="submit" className="px-3 py-2 mb-3 btn-gold">
                          Submit
                        </button>
                      )}
                </div>
              </form>

              <button className={`btn-gold ${changePassword ? 'bg-gold text-white' : ''}`} onClick={() => setChangePassword(prev => !prev)}>change password</button>
              {changePassword && 
                <form className="mt-3 form-profile" onSubmit={submitPassword}>
                  <div className="row">
                    <div className="col-sm mb-3">
                      <label htmlFor="oldpassword" className="form-label">
                        Old Password:
                      </label>
                      <input type="text" className="form-control input-white" id="oldpassword" name="oldpassword" onChange={e => setOldPassword(e.target.value)} />
                    </div>
                    <div className="col-sm mb-3">
                      <label htmlFor="newpassword" className="form-label">
                        New Password:
                      </label>
                      <input type="text" className="form-control input-white" id="newpassword" name="newpassword" onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div className="col-sm mb-3">
                      <label htmlFor="confirmnewpassword" className="form-label">
                        Confirm New Password:
                      </label>
                      <input type="text" className={`form-control input-white ${newPassword !== confirmNewPassword && 'border-danger'}`} id="confirmnewpassword" name="confirmnewpassword" onChange={e => setConfirmNewPassword(e.target.value)} />
                    </div>
                  </div>
                  {newPassWrong && <p className="text-danger">Confirm password doesn&apos;t match!</p>}
                  {passwordWrong && <p className="text-danger">Password incorrect!</p>}
                  {passwordError && <p className="text-danger">Error changing password!</p>}
                  <button className="btn-gold">submit</button>
                </form>
              }

              <div className="my-3">
                <div
                  className="form-label d-flex align-items-center gap-1"
                  onClick={() => displayWallet()}
                  style={{ cursor: "pointer" }}
                >
                  {showWallet ? <BsArrowUpCircle /> : <BsArrowDownCircle />} <p className="mb-0">Wallet/Cards</p>
                  <hr className="w-100" />
                </div>
                {showWallet && <div className="row wallet-row">
                  <div className={`col-3 wallet-col ${showTopUp ? 'd-flex align-items-center' : ''}`}><p className="mb-0">Wallet: {profileState.profileData.wallet} <button className="btn-gold" onClick={() => displayTopUp()}>add wallet</button></p></div>
                  {showTopUp && <div className="col-3 wallet-col">
                    <div className="form-profile">
                      <input type="number" className="form-control input-gold mont-bold" value={topUpPrice} onChange={e => setTopUpPrice(e.target.value)} placeholder="0" />
                      <button className="btn-gold" onClick={() => displayTopUpModal()}>top-up</button>
                    </div>
                      {insufficientTopUp && <p className="mb-0 text-danger">You can only top up more then 50</p>}
                  </div>}
                </div>}
              </div>

              <div className="my-3">
                <div
                  className="form-label d-flex align-items-center gap-1"
                  onClick={() => setShowAddress(prev => !prev)}
                  style={{ cursor: "pointer" }}
                >
                  {showAddress ? <BsArrowUpCircle /> : <BsArrowDownCircle />} <p className="mb-0">Address</p>
                  <hr className="w-100" />
                </div>
                <div className="container">
                  {showAddress && <button className="btn-gold" onClick={() => openModal(null)}>add address</button>}
                  {showAddress && (
                    profileState.profileData.addressList && profileState.profileData.addressList.length > 0 && (
                      profileState.profileData.addressList.map(item => {
                        return (
                          <div key={item._id} className="row mt-3 bg-gold text-white">
                            <div className="col-sm-8 py-1">
                              <p className="mont-bold">{item.addressName}</p>
                              <div className="d-flex align-items-center gap-2">
                                <p className="m-0 mont-bold">{item.receiverName}</p> <div className="sm-line"></div> <p className="m-0 mont-regular">{item.receiverNumber}</p>
                              </div>
                                <p className="mt-1 mb-0">{item.addressLine}<br />{item.city}, {item.state}, {item.zipCode}</p>
                            </div>
                            <div className="address-actions col-sm-4 d-flex justify-content-end align-items-center">
                              <button className="btn-white mx-1" onClick={() => openModal(item)}>edit</button>
                              <button className="btn-white" onClick={() => removeAddress(item._id)}>remove</button>
                            </div>
                          </div>
                        )
                      })
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  )
};

export default ProfileUserInfo;
