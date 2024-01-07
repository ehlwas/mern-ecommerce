require('dotenv').config()
const fs = require('fs'); // Add this line to import the fs module
const cloudinary = require('cloudinary').v2;

const Product = require('../models/productModel')
const Group = require('../models/groupModel')
const Size = require('../models/sizeModel')
const mongoose = require('mongoose')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// get Product
const getProducts = async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 }); 

    res.status(200).json(products);
}

// create new Product
const createProduct = async (req, res) => {
    const {productType, categoryId, model, color, specs } = req.body;

    let emptyFields = []

    if (!productType) {
        emptyFields.push('productType')
    }
    if (!categoryId) {
        emptyFields.push('categoryId')
    }
    if (!model) {
        emptyFields.push('model')
    }
    if (!color) {
        emptyFields.push('color')
    }
    if (!specs) {
        emptyFields.push('specs')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    // add doc to  db
    try {
        const product = await Product.create({ productType, categoryId, model, size, color, specs })
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({ error })
    }
}

const createProductList = async (req, res) => {
    try {
        const productsArray = req.body; // Assuming the array of objects is sent in the request body
    
        for (const product of productsArray) {
          const makeUrlId = product.model.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          const productWithUrlId = { ...product, urlId: makeUrlId }

          const newProduct = new Product(productWithUrlId);
          await newProduct.save();
        }
    
        res.status(200).json({ message: 'Products saved successfully' });
    } catch (error) {
        console.error('Error saving objects:', error);
        res.status(500).json({ message: 'Error saving objects' });
    }
}

const getCompleteProduct = async (req, res) => {
    try {
      const products = await Product.findOne({ urlId: req.params.urlId });
  
      if (!products) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const sizes = await Size.find({ productId: products._id });
  
      const completeInfoProduct = { ...products._doc, sizes };
  
      res.status(200).json(completeInfoProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to upload image to Cloudinary
async function uploadImageToCloudinary(imageData, makeUrlId) {
    try {
      // Save the image buffer to a temporary file
      const fileName = `${makeUrlId}_.png`;
      await saveImageDataToFile(imageData.buffer, fileName);
  
      // Upload the temporary file to Cloudinary
      const uploadOptions = {
        folder: 'agoy-assets', // Replace with the desired folder name (optional)
        use_filename: true // Preserve the original filename (optional)
      };
  
      const result = await cloudinary.uploader.upload(fileName, uploadOptions);
  
      // Handle the response
      console.log('Upload successful!');
      
      return result.secure_url;
    } catch (error) {
      console.error('Upload failed:', error.message);
    }
}

function saveImageDataToFile(imageBuffer, fileName) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, imageBuffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
}

// MAIN FUNCTION OF ADD PRODUCT
const createProductAndSize = async (req, res) => {
    try {
        //const productsArray = req.body; // Assuming the array of objects is sent in the request body
        const product = req.body;
        const imageFile = req.files[0]
        
        // for (const product of productsArray) {
            const makeUrlId = product.model.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          
            const existingProduct = await Product.findOne({ urlId: makeUrlId });
            if (existingProduct) {
                return res.status(409).json({ message: 'User already exists' });
            }
            
            // Upload image to Cloudinary
            const imageUrl = await uploadImageToCloudinary(imageFile, makeUrlId);

            // Insert urlId and imageURL
            const productWithUrlId = { ...product, urlId: makeUrlId, imageUrl: imageUrl }

            // Ready Sizes
            const productSizes = JSON.parse(product.sizes)

            const newProduct = new Product(productWithUrlId);
            const productId = await newProduct.save();
            
            for (const size of productSizes) {
                const sizes = { ...size, productId: productId._id }
                const newSize = new Size(sizes);
                await newSize.save();
            }
        // }
    
        res.status(200).json({ message: 'Products saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const param = req.params.categoryId
        const search = req.body.searchValue

        let products = null

        if (param === "Pre-Sleep" || param === "Sleep" || param === "Post-Sleep") {
            const groupId = await Group.findOne({ groupName: param})
            const groupIdString = groupId._id.toString()

            if (!search){
                // products = await Product.find({ groupId: groupId._id })

                products = await Product.aggregate([
                    {
                        $match: { groupId: groupIdString }
                    },
                    {
                        $addFields: {
                          productIdString: { $toString: '$_id' } // Convert _id to a string and add it as a new field
                        }
                    },
                    {
                        $lookup: {
                            from: 'sizes',
                            localField: 'productIdString',
                            foreignField: 'productId',
                            as: 'sizeData'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            groupId:1,
                            categoryId:1,
                            urlId:1,
                            model:1,
                            imageUrl:1,
                            'sizeData._id': 1,
                            'sizeData.productId': 1,
                            'sizeData.size': 1,
                            'sizeData.priceUSD': 1,
                            'sizeData.priceAED': 1
                        }
                    }
                ]).exec()
            }
            else {
                // products = await Product.find(
                //     { 
                //         groupId: groupId._id,
                //         model: { $regex: `.*${search}.*`, $options: 'i' }
                //     }
                // )
                products = await Product.aggregate([
                    {
                        $match: {
                            groupId: groupIdString,
                            model: { $regex: `.*${search}.*`, $options: 'i' }
                        }
                    },
                    {
                        $addFields: {
                          productIdString: { $toString: '$_id' } // Convert _id to a string and add it as a new field
                        }
                    },
                    {
                        $lookup: {
                            from: 'sizes',
                            localField: 'productIdString',
                            foreignField: 'productId',
                            as: 'sizeData'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            groupId:1,
                            categoryId:1,
                            urlId:1,
                            model:1,
                            imageUrl:1,
                            'sizeData._id': 1,
                            'sizeData.productId': 1,
                            'sizeData.size': 1,
                            'sizeData.priceUSD': 1,
                            'sizeData.priceAED': 1
                        }
                    }
                ]).exec()
            }
        }
        else {
            if (!search){
                // products = await Product.find({ categoryId: param })
                products = await Product.aggregate([
                    {
                        $match: { categoryId: param }
                    },
                    {
                        $addFields: {
                          productIdString: { $toString: '$_id' } // Convert _id to a string and add it as a new field
                        }
                    },
                    {
                        $lookup: {
                            from: 'sizes',
                            localField: 'productIdString',
                            foreignField: 'productId',
                            as: 'sizeData'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            groupId:1,
                            categoryId:1,
                            urlId:1,
                            model:1,
                            imageUrl:1,
                            'sizeData._id': 1,
                            'sizeData.productId': 1,
                            'sizeData.size': 1,
                            'sizeData.priceUSD': 1,
                            'sizeData.priceAED': 1
                        }
                    }
                ]).exec()
            }
            else {
                // products = await Product.find(
                //     { 
                //         categoryId: param,
                //         model: { $regex: `.*${search}.*`, $options: 'i' }
                //     }
                // )
                products = await Product.aggregate([
                    {
                        $match: {
                            categoryId: param,
                            model: { $regex: `.*${search}.*`, $options: 'i' }
                        },
                        
                    },
                    {
                        $addFields: {
                          productIdString: { $toString: '$_id' } // Convert _id to a string and add it as a new field
                        }
                    },
                    {
                        $lookup: {
                            from: 'sizes',
                            localField: 'productIdString',
                            foreignField: 'productId',
                            as: 'sizeData'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            groupId:1,
                            categoryId:1,
                            urlId:1,
                            model:1,
                            imageUrl:1,
                            'sizeData._id': 1,
                            'sizeData.productId': 1,
                            'sizeData.size': 1,
                            'sizeData.priceUSD': 1,
                            'sizeData.priceAED': 1
                        }
                    }
                ]).exec()
            }
        }
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting data' });
    }
}

const searchProduct = async (req, res) => {
    try {
        const search = req.params.searchValue
        
        const product = await Product.find(
            { model: { $regex: `.*${search}.*`, $options: 'i' } },
            { model: 1, urlId: 1, imageUrl: 1, _id: 0 }
        ).populate('groupId', 'groupName');

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: 'Error getting data' });
    }
}

module.exports = {
    getProducts,
    createProduct,
    createProductList,
    getCompleteProduct,
    createProductAndSize,
    getProductsByCategory,
    searchProduct
}