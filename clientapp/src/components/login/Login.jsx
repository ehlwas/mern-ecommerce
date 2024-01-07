import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ItemPropsContext } from '../../context/itemPropsContext'

import AGOYLogo from '../../assets/AGOY.svg'

import './login.css'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [wrongAccount, setWrongAccount] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const [emptyFields, setEmptyFields] = useState([])

    const { setFirstName } = useContext(ItemPropsContext);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setEmptyFields([])
        setWrongAccount(false)
        setErrorLogin(false)
        setLoadingBtn(true)

        if (rememberMe) {
            localStorage.setItem('rememberEmail', email)
        }
        else {
            localStorage.removeItem('rememberEmail')
        }
        
        const productHistory = sessionStorage.getItem('productHistory')
        
        await axios.post('/api/login', { email, password })
        .then(response => {
            // Assuming the response contains a token
            const token = response.data.token;
            const firstName = response.data.firstName;
            const cartCount = response.data.cartCount;

            // Save the token to local storage or state for future use
            localStorage.setItem('firstName', firstName)
            localStorage.setItem('token', token)
            localStorage.setItem('cartCount', cartCount)

            setFirstName(firstName);
            
            sessionStorage.removeItem('productHistory')

            if (productHistory) {
                window.location.replace(`${window.location.origin}//shop/sleep/${productHistory}`)
            }
            else {
                window.location.replace(`${window.location.origin}/`)
            }
        }).catch(err => {
            const response = err.response

            if (response.status === 400)
            {
                setEmptyFields(response.data.emptyFields)
            }
            else if (response.status === 401)
            {
                setWrongAccount(true)
            }
            else
            {
                setErrorLogin(true)
            }
            setLoadingBtn(false)
        })
    };

    useEffect(() => {
        const rememberMeItem = localStorage.getItem('rememberEmail')
        
        if (rememberMeItem) {
            setEmail(rememberMeItem)
            setRememberMe(true)
        }
    }, [])

    return (
        <>
            <div className='vh-100 text-dim d-flex justify-content-center align-items-center'>
                <form onSubmit={handleFormSubmit} className='p-3 mb-5 w-md-50 p-md-5  login-form'>
                    <div className='text-center'>
                    <img src={AGOYLogo} className='mb-5' alt='AGOY LOGO' width='150px' />
                    </div>
                    {/* Email input */}
                    <div className="form-outline mb-4">
                    <input type="email" className={`form-control input-black ${emptyFields.includes('email') || wrongAccount || errorLogin ? 'border-danger' : ''}`} name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
                    <label className="form-label">Email address</label>
                    </div>

                    {/* Password input */}
                    <div className="form-outline mb-4">
                    <input type="password" className={`form-control input-black ${emptyFields.includes('password') || wrongAccount || errorLogin ? 'border-danger' : ''}`} name='password' onChange={(event) => setPassword(event.target.value)} />
                    <label className="form-label">Password</label>
                    </div>

                    {/* 2 column grid layout for inline styling */}
                    <div className="row mb-4">
                    <div className="col-12 col-md d-flex justify-content-center">
                        {/* Checkbox */}
                        <div className="form-check">
                        <input className="form-check-input check-gold" type="checkbox" onClick={() => setRememberMe(prev => !prev)} checked={rememberMe} />
                        <label className="form-check-label text-gold"> Remember me </label>
                        </div>
                    </div>

                    <div className="col-12 col-md text-center mt-3 mt-md-0">
                        {/* Forgot password */}
                        <Link to='/forgot-password' className='text-gold'>Forgot password?</Link>
                    </div>
                    </div>

                    <div className='text-center'>
                    {/* Submit button */}
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
                        <button className="btn-gold py-1 px-3 btn-block mb-4">sign in</button>
                        {wrongAccount && <span className='ml-3 text-danger'>Wrong email or password!</span>}
                        {errorLogin && <span className='ml-3 text-danger'>Error logging in!</span>}
                        </p>
                    }
                    </div>

                    {/* Register buttons */}
                    <div className="text-center">
                    <p>Not a member? <Link to='/register' className='text-gold'>Register</Link></p>
                    {/* Social sign-up buttons */}
                    </div>
                </form>
            </div>

        </>
    )
}

export default Login