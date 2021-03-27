import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import crypto from 'crypto'
import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv'


dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//@desc GET user profile
//@route GET /api/users/login
//@access Private
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if (user && (await user.matchPassword(password))) {
        if (user.isVerified) {
            res.json({
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            })
        } else {
            res.status(401)
            throw new Error('Please verify your email')
        }
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

//@desc Register a new user
//@route GET /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, surname, email, password} = req.body
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const emailToken = crypto.randomBytes(64).toString('hex')
    const user = await User.create({
        name,
        surname,
        email,
        password,
        emailToken
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            isVerified: false
        })
        try {
            const msg = {
                to: user.email,
                from: "abyproshopfromtwilio@gmail.com",
                subject: "Welcome to Aby's Proshop, verify your email",
                text: `click the following link to activate your Proshop account and enjoy virtual shopping experience
           http://${req.headers.host}/verify-email?token=${user.emailToken}`,
                html: `
        <div className='d-flex justify-content-center py-3'>
        <h1>Hello ${user.name}, </h1>
        <p>Thanks for registering on our site</p>
        <p>Please click the link bellow to verify and activate your Proshop account</p>
        <a href="http://abyproshopapp.herokuapp.com/verify-email?token=${user.emailToken}"> Verify your account<a/>
        <strong> & Enjoy virtual shopping experience 🚀🚀🚀</strong>
        </div>`

            }
            sgMail.send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
            res.redirect('/login')
        } catch (error) {
            console.log(error)
            //req.send('error', 'Something went wrong. Please try again later or contact us at abyproshopfromtwilio@gmail.com for assistance')
            res.redirect('/')
        }

    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//@desc Verify Email
//@route GET /verify-email
//@access Public
const verifyEmail = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({emailToken: req.query.token})
    if (!user) {
        // req.send('error', 'Invalid Token. Please contact us for assistance')
        return res.redirect('/error')
    }
    //user.emailToken = null
    user.isVerified = true
    await user.save()

    const redirectUrl = '/'

    res.redirect(redirectUrl)

    if (err) {
        res.status(404)
        throw new Error('User not found')
    }

})


//@desc GET user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            surname: user.surname,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }

})

//@desc Update user profile
//@route PUT/api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.surname = req.body.surname || user.surname
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            surname: updatedUser.surname,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }

})

//@desc GET all users
//@route GET /api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

//@desc Delete user
//@route DELETE /api/users:id
//@access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({message: 'User removed'})
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//@desc Get user by ID
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }

})


//@desc Update user
//@route PUT/api/users/:id
//@access Private/admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.name = req.body.name || user.name
        user.surname = req.body.surname || user.surname
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            surname: updatedUser.surname,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }

})

export {
    authUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    verifyEmail
}

