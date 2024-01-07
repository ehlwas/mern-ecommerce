
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AGOYLogo from '../../assets/AGOY.svg'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [currentForm, setCurrentForm] = useState('get-email')
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [email, setEmail] = useState('')
  const [newPass, setNewPass] = useState('')
  const [verifyPin, setVerifyPin] = useState()
  
  const emailFormSubmit = async (e) => {
    e.preventDefault()

    const data = {
      email
    }

    await axios.post('/api/forgotpass', data)
    .then(response => {
      setCurrentForm('set-pin')
    }).catch(err => console.log(err))
  }

  const verifyPinSubmit = async (e) => {
    e.preventDefault()
    const verifyPinData = `${verifyPin.pin1}${verifyPin.pin2}${verifyPin.pin3}${verifyPin.pin4}${verifyPin.pin5}${verifyPin.pin6}`

    const data = {
      email,
      verifyPin: Number(verifyPinData)
    }

    await axios.post('/api/verifypin', data)
    .then(response => {
      sessionStorage.setItem('fpToken', response.data.token)
      setCurrentForm('reset-pass')
    }).catch(err => console.log(err))
  }

  const changePassSubmit = async (e) => {
    e.preventDefault()

    const fpToken = sessionStorage.getItem('fpToken')

    const config = {
      headers: {
        'x-access-token': fpToken
      }
    }
    const data = {
      newPass,
      verifyPin
    }
    await axios.post('/api/resetpass', data, config) 
    .then(response => {
      console.log(response)
      navigate('/login')
    }).catch(err => console.log(err))
  }

  const navigateToLogin = (e) => {
    e.stopPropagation;
    navigate("/login");
  };

  const displayedForm = () => {
    if (currentForm === 'get-email') {
      return (
        <form onSubmit={emailFormSubmit} className="p-3 mb-5 w-md-50 p-md-5 bg-white login-form h-75">
          <div className="text-center">
            <img src={AGOYLogo} className="mb-5" alt="AGOY LOGO" width="150px" />
          </div>          
          {/* Email input */}
          <div className="form-outline mb-4">
            <input type="email" className={`form-control input-gold`} name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
            <label className="form-label">Email address</label>
          </div>

          <div className='text-center'>
            {loadingBtn ? 
                <button className="btn-gold py-2 px-5 text-center btn-block mb-4" disabled>
                <div className="snippet" data-title="dot-pulse">
                    <div className="stage">
                    <div className="dot-pulse"></div>
                    </div>
                </div>
                </button>
                :
                <p className='mb-0'>
                <button className="btn-gold py-1 px-3 btn-block mb-4">submit</button>
                {/* {wrongAccount && <span className='ml-3 text-danger'>Wrong email or password!</span>}
                {errorLogin && <span className='ml-3 text-danger'>Error logging in!</span>} */}
                </p>
            }
              <button
                className="btn-gold py-1 px-3 btn-block mb-4"
                onClick={(e) => navigateToLogin(e)}
              >
                back to login
              </button>
          </div>
        </form>
      )
    }
    else if (currentForm === 'set-pin') {
      return (
        <form onSubmit={verifyPinSubmit} className="p-3 mb-5 w-md-50 p-md-5 bg-white login-form h-75">
          <div className="text-center">
            <img src={AGOYLogo} className="mb-5" alt="AGOY LOGO" width="150px" />
          </div>

          <div className="d-flex justify-content-center mb-3">
              <input type='number' className='input-gold' onChange={e => setVerifyPin(e.target.value)} placeholder='Enter code...'/>
          </div>

          <div className='text-center'>
            {loadingBtn ? 
                <button className="btn-gold py-2 px-5 text-center btn-block mb-4" disabled>
                <div className="snippet" data-title="dot-pulse">
                    <div className="stage">
                    <div className="dot-pulse"></div>
                    </div>
                </div>
                </button>
                :
                <p className='mb-0'>
                <button className="btn-gold py-1 px-3 btn-block mb-4">submit</button>
                {/* {wrongAccount && <span className='ml-3 text-danger'>Wrong email or password!</span>}
                {errorLogin && <span className='ml-3 text-danger'>Error logging in!</span>} */}
                </p>
            }
          </div>
        </form>
      )
    }
    else if (currentForm === 'reset-pass') {
      return (
        <form onSubmit={changePassSubmit} className="p-3 mb-5 w-md-50 p-md-5 bg-white login-form h-75">
          <div className="text-center">
            <img src={AGOYLogo} className="mb-5" alt="AGOY LOGO" width="150px" />
          </div>

          <div className="form-outline mb-4">
            <input type="password" className={`form-control input-gold`} name='password' value={newPass} onChange={(event) => setNewPass(event.target.value)} />
            <label className="form-label">Enter New Password:</label>
          </div>

          <div className='text-center'>
            {loadingBtn ? 
                <button className="btn-gold py-2 px-5 text-center btn-block mb-4" disabled>
                <div className="snippet" data-title="dot-pulse">
                    <div className="stage">
                    <div className="dot-pulse"></div>
                    </div>
                </div>
                </button>
                :
                <p className='mb-0'>
                <button className="btn-gold py-1 px-3 btn-block mb-4">submit</button>
                {/* {wrongAccount && <span className='ml-3 text-danger'>Wrong email or password!</span>}
                {errorLogin && <span className='ml-3 text-danger'>Error logging in!</span>} */}
                </p>
            }
          </div>
        </form>
      )
    }
  }

  return (
    <>
      <div className="vh-100 text-gold d-flex justify-content-center align-items-center">
        {displayedForm()}
      </div>
    </>
  );
};

export default ForgotPassword;
