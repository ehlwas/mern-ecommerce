const express = require("express");

const { 
    createCategoryList,
    getCategories,
    getCategoryGroup
} = require('../controllers/categoryController')

const router = express.Router();

// ROUTES
router.get("/", getCategories)
router.get("/:groupName", getCategoryGroup)
router.post("/", createCategoryList)
  
module.exports = router;