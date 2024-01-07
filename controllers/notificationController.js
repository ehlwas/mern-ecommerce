const Notification = require('../models/notificationModel')
const mongoose = require('mongoose')

const createNotification = async (userId, notificationType, data) => {
    try {
        const nowDate = new Date()
        const formattedDate = `${nowDate.getMonth() + 1}/${nowDate.getDate()}/${nowDate.getFullYear()}`;

        let description = ''

        if (notificationType === 'topup') {
            description = `You topped up ${data.amount} in your wallet.`
        }
        else if (notificationType === 'ordered') {
            description = `Your order is successful. Reference number: ${data.referenceNumber}.`
        }
        else if (notificationType === 'gainedPoints') {
            // NOTE: THIS IS STILL NOT INTEGRATED
            description = `You gained ${data.points} loyalty points from the order with reference number: ${data.referenceNumber}.`
        }
        else if (notificationType === 'updatedProfile') {
            description = `You updated your profile on ${formattedDate}.`
        }
        else if (notificationType === 'changedPass') {
            description = `You changed your password on ${formattedDate}.`
        }
        else if (notificationType === 'addedAddress') {
            description = `You added ${data.addressTitle} to your address.`
        }
        else if (notificationType === 'removedAddress') {
            description = `You removed ${data.addressTitle} from your address.`
        }
        else if (notificationType === 'updatedAddress') {
            description = `You updated ${data.addressTitle} in your address.`
        }

        const newNotification = new Notification({
            userId,
            description,
            isRead: false
        })

        await newNotification.save()
    } catch (error) {
        console.error(error);
    }
}

const getNotificationList = async (req, res) => {
    try {
        const { userId } = req.user
        const { page } = req.body
        
        const itemsPerPage = 10;

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)

        res.status(200).json(notifications)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting notification' });
    }
}

const readAll = async (req, res) => {
    try {
        const { userId } = req.user
        await Notification.updateMany(
            { userId: userId, isRead: false },
            { $set: { isRead: true } })
            
        res.status(200).json({ message: 'Read all.' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting reading all.' });
    }
}

const readNotification = async (req, res) => {
    try {
        const { notificationId } = req.body
        await Notification.updateMany(
            { _id: notificationId },
            { $set: { isRead: true } })

        res.status(200).json({ message: `Read ${notificationId}.` });
    } catch (error) {
        res.status(500).json({ message: 'Error getting reading all.' });
    }
}

module.exports = {
    createNotification,
    getNotificationList,
    readAll,
    readNotification
}