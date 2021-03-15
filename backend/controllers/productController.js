import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 5
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}
    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
    res.json({products, page, pages: Math.ceil(count / pageSize)})
})

//@desc Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw  new Error('Product not found')
    }
})


//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.remove()
        res.json({message: 'Product removed'})
    } else {
        res.status(404)
        throw  new Error('Product not found')
    }
})


//@desc Create a product
//@route POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = await new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc Create new review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment} = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        let alreadyReviewed = product.reviews.findIndex(r => r.user.toString() === req.user._id.toString())
        if (alreadyReviewed>=0) {
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id
            }
            product.reviews[alreadyReviewed] = review;
            product.save();
            res.status(201).json({message: 'Review changed'})
        } else {
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        await product.save()
        res.status(201).json({message: 'Review added'})
        }
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc Update the review
//@route PUT /api/products/:id/reviews
//@access Private
const updateProductReview = asyncHandler(async (req, res) => {
    const {rating, comment} = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        const review = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (review) {
            review.name = req.user.name,
            review.rating = req.body.rating,
            review.comment = req.body.comment
            await product.save();
            res.status(200).send().json({message: 'Review updated'})
        }
        else {
            res.status(404)
            throw new Error('Review not found')
        }
    }  else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc Delete a review
//@route DELETE /api/products/:id/reviews
//@access Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        const reviews = product.reviews.filter(r => r.user.toString() !== req.user._id.toString())
        if (reviews) {
            product.reviews = reviews
            await product.save()
            res.json({message: 'Review removed'})
        } else {
            res.status(404)
            throw  new Error('Product not found')
        }
    }
    res.status(500).send("ERROR")
})


//@desc Get top rated products
//@route POST /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3)
    res.json(products)
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    createProductReview,
    updateProductReview,
    deleteReview,
    getTopProducts

}
