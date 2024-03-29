import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc Fetch wishlist
//@route GET /api/wishlist
//@access Public


const getWishList = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw  new Error('Product not found')
    }
})

export { getWishList }
