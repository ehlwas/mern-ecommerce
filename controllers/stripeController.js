const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createToken = async () => {
    var param = {};
    param.card ={
        number: '4242424242424242',
        exp_month: 2,
        exp_year:2024,
        cvc:'212'
    }

    const tokenCard = await stripe.tokens.create(param, function (err,token) {
        if(err)
        {
            console.log("err: "+err);
        }if(token)
        {
            console.log("success: "+JSON.stringify(token, null, 2));
        }else{
            console.log("Something wrong")
        }
    })

    return tokenCard
}

const paymentCharge = async (req, res) => {
    try {
        const tokenCard = await createToken()

        res.status(200).json(tokenCard)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error processing' })
    }
}

const makePayment = async (cardDetails, amountInCents) => {
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardDetails.ccNumber,
          exp_month: cardDetails.ccMonth,
          exp_year: cardDetails.ccYear,
          cvc: cardDetails.cvc,
        },
      });
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method: paymentMethod.id,
        confirm: true,
      });
  
      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

const templatedPayment = async (req, res) => {
    const cardDetails = {
        ccNumber: '4242424242424242',
        ccMonth: 10,
        ccYear: 30,
        cvc: '114',
    };
      
    const amountInCents = 1000; // For example, $10.00 in cents
    
    await makePayment(cardDetails, amountInCents)
    .then((paymentIntent) => {
        console.log('Payment successful:', paymentIntent.id);
    })
    .catch((error) => {
        console.error('Payment failed:', error.message);
    });
}

module.exports = {
    paymentCharge,
    templatedPayment
}