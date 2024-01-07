import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ItemPropsContext } from "../../context/itemPropsContext";
import axios from "axios";

import { DotSpinner } from '@uiball/loaders'

import './checkout-confirmation.css'

const CheckoutConfirmation = () =>{
    const navigate = useNavigate();
    const { token } = useContext(ItemPropsContext);

    const [isSuccess, setIsSuccess] = useState(false)

    const changeComponent = () => {
        document.body.style.overflow = "auto";
        sessionStorage.removeItem('cartToken')
        localStorage.removeItem('pi')
        localStorage.setItem('cartCount', 0)
        window.location.replace(`${window.location.origin}/`)
    }

    const processCheckout = async () => {
        const cartToken = sessionStorage.getItem('cartToken')
        const firstName = sessionStorage.getItem('firstName')
        
        const config = {
            headers: {
                "x-access-token": token,
                "x-access-token-cart": cartToken
            }
        };

        const data = {
            "firstName": firstName
        }

        await axios.post('/api/cart/checkoutProcess', data, config)
        .then(response => {
            if (response.status === 200)
            {
                setIsSuccess(true)
                setTimeout(changeComponent, 3000)
            }
        }).catch (err => {
            console.log(err)
            navigate("/")
        }) 
    }

    const processCheckoutGuest = async () => {
        const cartToken = sessionStorage.getItem('cartToken')
        
        const config = {
            headers: {
                "x-access-token-cart": cartToken
            }
        };

        const data = {
            "guest": "This is guest"
        }

        await axios.post('/api/checkoutProcess', data, config)
        .then(response => {
            if (response.status === 200)
            {
                setIsSuccess(true)
                setTimeout(changeComponent, 3000)
            }
        }).catch (err => {
            console.log(err)
            navigate("/")
        }) 
    }

    
    useEffect(() => {
        document.body.style.overflow = "hidden";
        if (token)
            processCheckout()
        else 
            processCheckoutGuest()
    }, [])

    return (
        <>
            <div className="modal bg-gold" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!isSuccess ? 
                <div className="loading-content bg-gold width-500 height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <DotSpinner 
                        size={100}
                        speed={0.9} 
                        color="blue" 
                    />
                    <p style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Processing...</p>
                </div> 
                    :
                <div className="checkmark-content bg-gold width-500 height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className="checkmark-icon" style={{ fontSize: "48px", color: "#fff", marginBottom: "10px" }}>✓</div>
                    <p style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Ordered Successful!</p>
                </div>}
            </div>
        </>
    )
}

export default CheckoutConfirmation