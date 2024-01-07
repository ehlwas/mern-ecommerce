const Group = require('../models/groupModel')
const mongoose = require('mongoose')

// get Group
const getGroups = async (req, res) => {
    const groups = await Group.find({}).sort({ createdAt: -1 }); 

    res.status(200).json(groups);
}

const createGroups = async (req, res) => {
    try {
        const groupsArray = req.body; // Assuming the array of objects is sent in the request body
    
        for (const group of groupsArray) {
          const newGroup = new Group(group);
          await newGroup.save();
        }
    
        res.status(200).json({ message: 'Products saved successfully' });
    } catch (error) {
        console.error('Error saving objects:', error);
        res.status(500).json({ message: 'Error saving objects' });
    }
}

module.exports = {
    getGroups,
    createGroups
}