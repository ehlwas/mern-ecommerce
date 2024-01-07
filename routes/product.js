const express = require("express");
const multer = require("multer");

const { 
    // createProductList,    
    getProducts,
    getCompleteProduct,
    createProductAndSize,
    getProductsByCategory,
    searchProduct,
} = require('../controllers/productController')

const upload = multer();

const router = express.Router();

const auth = require('../middleware/auth')

// ROUTES
router.get("/", getProducts)
router.get("/search/:searchValue", searchProduct)
// router.get('/:categoryId', getProductsByCategory);
router.post('/:categoryId', getProductsByCategory);
router.get('/item/:urlId', getCompleteProduct);
router.post('/', upload.any(), createProductAndSize);
// router.post("/", createProductList)
  
module.exports = router;