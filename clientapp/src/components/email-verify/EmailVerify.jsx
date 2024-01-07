import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ItemPropsContext } from "../../context/itemPropsContext";

const EmailVerify = () => {
  const { token } = useContext(ItemPropsContext)

  const navigate = useNavigate()

  const [verifyCode, setVerifyCode] = useState('')
  const [loadingSendCode, setLoadingSendCode] = useState(false)
  const [sendCodeError, setSendCodeError] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [pinExpired, setPinExpired] = useState(false)
  const [errorPin, setErrorPin] = useState(false)
  const [verifyError, setVerifyError] = useState(false)
  const [successVerification, setSuccessVerification] = useState(false)

  const sendCode = async (e) => {
    e.preventDefault()

    setLoadingSendCode(true)
    setSendCodeError(false)
    
    const config = {
      headers: {
        'x-access-token': token
      }
    }

    const data = {
      emailVerify: 'emailVerify'
    }

    await axios.post('/api/user/send/emailverify', data, config)
    .then(response => {
      console.log(response)
      setEmailSent(true)
    }).catch(() => {
      setLoadingSendCode(false)
      setSendCodeError(true)
    })


  }

  const formSubmit = async (e) => {
    e.preventDefault()
    
    setLoadingBtn(true)
    setPinExpired(false)
    setErrorPin(false)
    setVerifyError(false)

    const config = {
      headers: {
        'x-access-token': token
      }
    }

    const data = {
      verifyCode: Number(verifyCode)
    }

    await axios.post('/api/user/verify/emailcode', data, config)
    .then(() => {
      setLoadingBtn(false)
      setSuccessVerification(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }).catch(err => {
      if (err.response.status === 498) {
        setPinExpired(true)
      }
      else if (err.response.status === 401) {
        setErrorPin(true)
      }
      else {
        setVerifyError(true)
      }

      setLoadingBtn(false)
    })    
  }

  return (
    <>
      <div className="vh-100 text-gold d-flex justify-content-center align-items-center">
        <form
          onSubmit={formSubmit}
          className="p-3 mb-5 w-md-50 p-md-5 bg-white login-form h-75"
        >
          {/* <div className="text-center">
            <img
              src={AGOYLogo}
              className="mb-5"
              alt="AGOY LOGO"
              width="150px"
            />
          </div> */}
          {/* Email input */}
          <div className="form-outline mb-4">
            <div className="d-flex position-relative">
              <input
                type="number"
                className={`form-control input-gold`}
                name="emailPin"
                value={verifyCode}
                onChange={(event) => setVerifyCode(event.target.value)}
                disabled={loadingBtn}
              />
              {emailSent ? <p className="position-absolute end-0 py-1 px-3">code sent!</p>
                :
              <p className="position-absolute end-0">
                {loadingSendCode ? 
                  <button className="btn-gold py-1 px-4" disabled>
                  <div className="snippet" data-title="dot-pulse">
                    <div className="stage">
                      <div className="dot-pulse"></div>
                    </div>
                  </div>
                  </button>
                  : 
                  <button className="btn-gold py-1 px-3" onClick={(e) => sendCode(e)}>
                  send code
                  </button>
                  }
                </p>}
            </div>
            <label className="form-label">Verification Code</label>
          </div>

          <div className="text-center">
            {loadingBtn ? (
              <button
                className="btn-gold py-2 px-5 text-center btn-block mb-4"
                disabled
              >
                <div className="snippet" data-title="dot-pulse">
                  <div className="stage">
                    <div className="dot-pulse"></div>
                  </div>
                </div>
              </button>
            ) : (
              successVerification ? 
              <p className="mb-0">
                <span className='ml-3'>Verification Success!</span>
              </p>
              :
              <p className="mb-0">
                <button className="btn-gold py-1 px-3 btn-block mb-4">
                  submit
                </button>
                {pinExpired && <span className='ml-3 text-danger'>PIN Expired!</span>}
                {errorPin && <span className='ml-3 text-danger'>Wrong PIN!</span>}
                {verifyError && <span className='ml-3 text-danger'>Verification Error!</span>}
                {sendCodeError && <span className='ml-3 text-danger'>Error Sending Code.</span>}
              </p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default EmailVerify;
