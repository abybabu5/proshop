import express from 'express'
import dotenv from 'dotenv'
import path from "path";
import colors from 'colors'
import listEndpoints from 'express-list-endpoints'
import morgan from 'morgan'
import cors from "cors"
import Stripe from "stripe";
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import {notFound, errorHandler} from "./middleware/errorMiddileware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import wishListRoutes from "./routes/wishListRoutes.js";
import {verifyEmail} from "./controllers/userController.js";


dotenv.config()
connectDB()
const secret = process.env.STRIPE_SECRET_KEY
export const stripe = new Stripe(secret)

const app = express()
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(cors())
app.use(express.json())
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json)

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/wishlist', wishListRoutes)
app.get('/verify-email', verifyEmail)

app.post('/api/payments/create', async (request, response) => {
    const {totalPrice} = request.body;
    console.log('Payment request Received BOOM!! for this amount: ', totalPrice, request.body)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: "usd"
    });
    // OK- Created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}

app.use(notFound)
app.use(errorHandler)
console.log(listEndpoints(app))

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Sever is running in ${process.env.NODE_ENV} mode on port: ${PORT}`.rainbow.bold))
