const User = require('../models/userModel')
const Loyalty = require('../models/loyaltyModel')
const Points = require('../models/pointsModel')
const Wallet = require('../models/walletModel')
const mongoose = require('mongoose')

const { createWalletRecord } = require('./walletController')
const { checkExpiredPoints } = require('./pointsController')

const addTotalPoints = async (userId, gainedPoints) => {
    try {
        const loyalty = await Loyalty.findOne({ userId });

        if (!loyalty) {
            // Handle the case where no loyalty record was found for the user
            throw new Error("Loyalty record not found for user");
        }

        loyalty.totalPoints = (parseFloat(gainedPoints) + parseFloat(loyalty.totalPoints)).toFixed(2);

        await loyalty.save();

        console.log(`Updated total points for user ${userId} to ${loyalty.totalPoints}`);
    } catch (error) {
        console.log(error)
    }
}

const createLoyaltyRecord = async (userId) => {
    try {
        let membershipNumber;
        let isUnique = false;

        while (!isUnique) {
            membershipNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString();
            const existingLoyalty = await Loyalty.findOne({ membershipNumber });

            if (!existingLoyalty) {
                isUnique = true;
            }
        }

        const loyaltyRecord = new Loyalty({
            userId,
            membershipNumber,
            loyaltyTier: 'Bronze',
            totalPoints: 0
        })

        const newLoyalty = await loyaltyRecord.save()

        return newLoyalty
        
    } catch (error) {
        console.log(error)
    }
}

const getLoyaltyInfo = async (req, res) => {
    try {
        const userId = req.user.userId
        
        await checkExpiredPoints(userId)
        
        let loyalty = await Loyalty.findOne({ userId })
        let wallet = await Wallet.findOne({ userId })
        let user = await User.findById(userId)

        if (wallet.length <= 0) {
            wallet = await createWalletRecord(userId)
        }

        if (loyalty.length <= 0) {
            loyalty = await createLoyaltyRecord(userId)
        }

        const returnLoyalty = {
            ...loyalty._doc,
            currentPoints: wallet.loyaltyPoints,
            ...user._doc
        }
        
        res.status(200).json(returnLoyalty)
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve Loyalty Information" })
    }
}

module.exports = {
    getLoyaltyInfo,
    addTotalPoints
}