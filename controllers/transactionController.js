require('dotenv')
const mongoose = require('mongoose');

const Transaction = require('../models/transactionModel');

// Get all users
const getTransactions = async (req, res) => {
  try {
    const { userId } = req.user;
    const filterRequest = req.params.filter

    let setFilter = 'all'

    if (filterRequest === 'pending') {
      setFilter = 'Pending'
    }
    else if (filterRequest === 'toreceive') {
      setFilter = 'To Receive'
    }
    else if (filterRequest === 'completed') {
      setFilter = 'Completed'
    }
    else if (filterRequest === 'canceled') {
      setFilter = 'Canceled'
    }

    let transactions;

    if (setFilter === 'all') {
      transactions = await Transaction.find({ userId }, { createdAt: 1, status: 1, paymentMethod: 1, transactionTotalPriceAED: 1, transactionTotalPriceUSD: 1, referenceNumber: 1 }).sort({ createdAt: -1 });
    } 
    else {
      transactions = await Transaction.find({ userId, status: setFilter }, { createdAt: 1, status: 1, paymentMethod: 1, transactionTotalPriceAED: 1, transactionTotalPriceUSD: 1, referenceNumber: 1 }).sort({ createdAt: -1 });
    }
    
    // Format createdAt dates to readable month date
    const formattedTransactions = transactions.map((transaction) => ({
      ...transaction._doc,
      createdAt: new Date(transaction.createdAt).toLocaleDateString(),
    }));

    res.status(200).json(formattedTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting transactions' });
  }
};

const getTransactionDetails = async (req, res) => {
  try {
    const { userId } = req.user;
    const _id = new mongoose.Types.ObjectId(req.params.id)
    
    const transactions = await Transaction.aggregate([
      { $match: { _id, userId } },
      {
        $lookup: {
          from: 'transactionitems',
          let: { transactionId: { $toString: '$_id' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$transactionId', '$$transactionId'] } } },
            {
              $lookup: {
                from: 'products',
                let: { productId: { $toObjectId: '$productId' } },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$productId'] } } }
                ],
                as: 'product'
              }
            },
            {
              $lookup: {
                from: 'sizes',
                let: { sizeId: { $toObjectId: '$sizeId' } },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$sizeId'] } } }
                ],
                as: 'size'
              }
            }
          ],
          as: 'transactionItems'
        }
      },
      {
        $project: {
          _id: 0,
          referenceNumber: 1,
          stripeId: 1,
          paymentMethod: 1,
          status: 1,
          receiverName: 1,
          receiverNumber: 1,
          deliveryAddress: 1,
          transactionTotalPriceAED: 1,
          transactionTotalPriceUSD: 1,
          transactionTotalPoints: 1,
          transactionPointsUsed: 1,
          transactionWalletUsed: 1,
          'transactionItems.quantity': 1,
          'transactionItems.totalPriceAED': 1,
          'transactionItems.totalPriceUSD': 1,
          'transactionItems.product.urlId': 1,
          'transactionItems.product.model': 1,
          'transactionItems.product.color': 1,
          'transactionItems.product.description': 1,
          'transactionItems.product.imageUrl': 1,
          'transactionItems.size.size': 1,
          'transactionItems.size.priceUSD': 1,
          'transactionItems.size.priceAED': 1,
        }
      }
    ]);

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting transactions' });
  }
}

const getTransactionDetailsGuest = async (req, res) => {
  try {
    const userId = 'N/A';
    const referenceNumber = Number(req.params.refNum);

    const transactions = await Transaction.aggregate([
      { $match: { referenceNumber, userId } },
      {
        $lookup: {
          from: 'transactionitems',
          let: { transactionId: { $toString: '$_id' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$transactionId', '$$transactionId'] } } },
            {
              $lookup: {
                from: 'products',
                let: { productId: { $toObjectId: '$productId' } },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$productId'] } } }
                ],
                as: 'product'
              }
            },
            {
              $lookup: {
                from: 'sizes',
                let: { sizeId: { $toObjectId: '$sizeId' } },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$sizeId'] } } }
                ],
                as: 'size'
              }
            }
          ],
          as: 'transactionItems'
        }
      },
      {
        $project: {
          _id: 0,
          referenceNumber: 1,
          stripeId: 1,
          paymentMethod: 1,
          status: 1,
          receiverName: 1,
          receiverNumber: 1,
          deliveryAddress: 1,
          transactionTotalPriceAED: 1,
          transactionTotalPriceUSD: 1,
          guestEmail: 1,
          'transactionItems.quantity': 1,
          'transactionItems.totalPriceAED': 1,
          'transactionItems.totalPriceUSD': 1,
          'transactionItems.product.urlId': 1,
          'transactionItems.product.model': 1,
          'transactionItems.product.color': 1,
          'transactionItems.product.description': 1,
          'transactionItems.product.imageUrl': 1,
          'transactionItems.size.size': 1,
          'transactionItems.size.priceUSD': 1,
          'transactionItems.size.priceAED': 1,
        }
      }
    ]);

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: 'Error getting transactions' });
  }
};


module.exports = {
  getTransactions,
  getTransactionDetails,
  getTransactionDetailsGuest
};


// {
//   $project: {
//     _id: 0,
//     referenceNumber: 1,
//     stripeId: 1,
//     paymentMethod: 1,
//     status: 1,
//     receiverName: 1,
//     receiverNumber: 1,
//     deliveryAddress: 1,
//     transactionTotalPriceAED: 1,
//     transactionTotalPriceUSD: 1,
//     'transactionItems.quantity': 1,
//     'transactionItems.totalPriceAED': 1,
//     'transactionItems.totalPriceUSD': 1,
//     'transactionItems.product.urlId': 1,
//     'transactionItems.product.model': 1,
//     'transactionItems.product.color': 1,
//     'transactionItems.product.description': 1,
//     'transactionItems.product.imageUrl': 1,
//     'transactionItems.size.size': 1,
//     'transactionItems.size.priceUSD': 1,
//     'transactionItems.size.priceAED': 1,
//   }
// }