const Size = require('../models/sizeModel')
const mongoose = require('mongoose')

// get Size
const getSizes = async (req, res) => {
    const sizes = await Size.find({}).sort({ createdAt: -1 }); 

    res.status(200).json(sizes);
}

const createSizes = async (req, res) => {
    try {
        const sizesArray = req.body; // Assuming the array of objects is sent in the request body
    
        for (const size of sizesArray) {
          const newSize = new Size(size);
          await newSize.save();
        }
    
        res.status(200).json({ message: 'Products saved successfully' });
    } catch (error) {
        console.error('Error saving objects:', error);
        res.status(500).json({ message: 'Error saving objects' });
    }
}

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}
  
const updateSizesWithRandomPoints = async (req, res) => {
    try {
      // Fetch all documents from the Size collection
      const sizeList = await Size.find({});
  
      // Loop through each item and add the 'points' property with a random number
      const updatedSizeList = sizeList.map(item => {
        const randomNumber = getRandomNumber(0.3, 9.0);
        return {
          ...item.toObject(),
          points: randomNumber.toFixed(1)
        };
      });
  
      // Update each item in the collection with the new 'points' property
      for (const updatedSizeItem of updatedSizeList) {
        await Size.updateOne({ _id: updatedSizeItem._id }, { $set: { points: updatedSizeItem.points } });
      }
  
      console.log('Collection updated successfully.');
      res.status(200).json({ message: 'Success!' })
    } catch (err) {
        console.log(err)
        res.status(200).json({ message: 'Failed!' })
    }
}

module.exports = {
    getSizes,
    createSizes,
    updateSizesWithRandomPoints
}