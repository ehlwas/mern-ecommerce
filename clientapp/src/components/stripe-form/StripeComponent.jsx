import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./StripeForm";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const StripeComponent = ({ submitHandler, price }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  const getConfig = async () => {
    axios.get('/api/cartguest/config')
    .then(async (response) => {
        console.log(response.data)
        setStripePromise(loadStripe(response.data.publishableKey));
    })
  }

  const createPaymentIntent = async () => {
    const data = { price: Number(price) }
    axios.post('/api/cartguest/create-payment-intent', data)
    .then(async (response) => {
        setClientSecret(response.data.clientSecret);
    })
  }

  const initialize = async () => {
    await getConfig()
    await createPaymentIntent()
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeForm submitHandler={submitHandler} />
        </Elements>
      )}
    </>
  );
}

export default StripeComponent;