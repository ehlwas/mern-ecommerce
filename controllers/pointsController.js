const User = require('../models/userModel')
const Loyalty = require('../models/loyaltyModel')
const Points = require('../models/pointsModel')
const Wallet = require('../models/walletModel')
const mongoose = require('mongoose')

const createPointsRecord = async (userId, points, pointsType, referenceNumber) => {
    try {
        // Create a Date object for today's date
        var pointsExpiration = new Date();

        // Add 3 weeks to the date
        // pointsExpiration.setDate(pointsExpiration.getDate() - 1); // 21 days = 3 weeks
        pointsExpiration.setDate(pointsExpiration.getDate() + 21); // 21 days = 3 weeks

        const newPoints = new Points({
            userId,
            transactionReferenceNumber: referenceNumber,
            points,
            pointsType,
            pointsExpiration,
            expirationEffect: false
        })

        const newPointsObject = await newPoints.save()

        return newPointsObject
        
    } catch (error) {
        console.log(error)
    }
}

const checkExpiredPoints = async (userId) => {
    try {
        const currentDate = new Date();

        const points = await Points.find({
            userId,
            pointsType: 'Earned',
            expirationEffect: false,
            pointsExpiration: { $lt: currentDate },
        });

        if (points.length === 0) {
            return;
        }

        let expiredArrayObject = [];
        let totalPointsDeducted = 0;

        // Deduct points from the wallet and create expired point objects
        points.forEach((item) => {
            totalPointsDeducted += item.points;

            const newExpiredObject = new Points({
                userId,
                transactionReferenceNumber: item.transactionReferenceNumber,
                points: item.points,
                pointsType: 'Expired',
                pointsExpiration: item.pointsExpiration,
                expirationEffect: true,
            });

            expiredArrayObject.push(newExpiredObject);
        });

        // Use Promise.all to perform multiple async operations concurrently
        await Promise.all([
            Points.insertMany(expiredArrayObject),
            Points.updateMany(
                { userId, _id: { $in: points.map((item) => item._id) } },
                { $set: { expirationEffect: true } }
            ),
            Wallet.updateOne(
                { userId },
                { $inc: { loyaltyPoints: -totalPointsDeducted } }
            )
        ]);

    } catch (error) {
        console.error("An error occurred:", error);
    }
};


const getPointsList = async (req, res) => {
    try {
        const userId = req.user.userId;
        // NOTE: filter must only have filter of 'All', 'Earned', 'Spend'
        // In Front-End it shows Earning and Spending but in Back-End its different
        // pointsType values: Earned = Earning | Spend = Spending | Expired = Expired
        const filter = req.params.filter

        await checkExpiredPoints(userId)

        let points;

        if (filter === 'All') {
            points = await Points.find({ userId }).sort({ createdAt: -1 })
        } else if (filter === 'Earned') {
            points = await Points.find({ userId, pointsType: filter }).sort({ createdAt: -1 })
        } else {
            points = await Points.find({ userId, pointsType: { $in: ['Expired', 'Spend'] } }).sort({ createdAt: -1 })
        }

        res.status(200).json(points)
    } catch (error) {
        res.status(500).json({ message: 'Failed to get points list' })
    }
}
module.exports = {
    createPointsRecord,
    getPointsList,
    checkExpiredPoints
}