import express from 'express'
const router = express.Router()
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
    createProductReview,
    getTopProducts, updateProductReview, deleteReview
} from '../controllers/productController.js'
import { protect, admin } from "../middleware/authMiddleware.js";



//@desc Fetch all products
//@route GET /api/products
//@access Public
router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, createProductReview).put(protect, updateProductReview).delete(protect, admin, deleteReview)
router.get('/top', getTopProducts)
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)



export default router
