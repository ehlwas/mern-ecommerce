const Category = require('../models/categoryModel')
const Group = require('../models/groupModel')

const getCategories = async (req, res) => {
    const categories = await Category.find({}, { createdAt: 0, updatedAt: 0}).sort({ createdAt: -1 }); 

    res.status(200).json(categories);
}

const createCategoryList = async (req, res) => {
    try {
        const categoriesArray = req.body; // Assuming the array of objects is sent in the request body
    
        for (const category of categoriesArray) {
          const newCategory = new Category(category);
          await newCategory.save();
        }
    
        res.status(200).json({ message: 'Products saved successfully' });
    } catch (error) {
        console.error('Error saving objects:', error);
        res.status(500).json({ message: 'Error saving objects' });
    }
}

const getCategoryGroup = async (req, res) => {
    try {
        const groupId = await Group.findOne({ groupName: req.params.groupName})

        const categories = await Category.find({ groupId: groupId._id })

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching.' });
    }
}

module.exports = {
    getCategories,
    createCategoryList,
    getCategoryGroup
}