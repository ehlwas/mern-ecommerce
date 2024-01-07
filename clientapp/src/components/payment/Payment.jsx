import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

import './payment.css'

const StripeForm = () => {
  const handleToken = async (token) => {
    // Send the cart list data to the Node.js server
    try {
      const response = await axios.post('/api/processCartList', {
        token: token,
        cartList: ['this', 'is', 'data'],
      });
      
      console.log(response.data); // Processed data from the server
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='mt-5'>
      <span className='payment-span'>Hello</span>
      <StripeCheckout
        stripeKey="pk_test_51NLLQZKH5hjpfWlaeGj0MFAn7n1u0uyOAKNDtpgABDC8posPnCOIG4Ms3BBZv09rfDvqF0TVPIuoFiQ73tFmjSW5001JDKVxyv"
        token={handleToken}
        amount={100.99}
        currency="USD"
      ><button className='btn-black'>Pay</button></StripeCheckout>
    </div>
  );
};

export default StripeForm;
