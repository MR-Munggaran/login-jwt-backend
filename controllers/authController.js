const User = require('../models/User')
const jwt = require('jsonwebtoken')
const createError = require('../utils/appError')
const bcrypt = require('bcrypt')

exports.signUp = async(req, res, next)=> {
    try {
        const user = await User.findOne({email : req.body.email})
        if(user){
            const err = new createError("User already registered", 400);
            res.status(400).send(err)
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const newUser = await User.create({
            ...req.body, password: hashedPassword
        })

        // JWT
        const token = jwt.sign({_id: newUser._id}, "katakunci00", {
            expiresIn: '90d'
        })

        res.status(201).json({
            status: 'success',
            message: 'User Registered successfully',
            token,
            user: {
                _id : newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })

    } 
    catch (error) {
        next(error);
    }
};
exports.login = async(req, res, next)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user) return next(new createError("User not found!", 404))

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return next(new createError('Invalid email or password', 401))
        }

        const token = jwt.sign({_id: user._id}, "katakunci00", {
            expiresIn: '90d'
        })

        res.status(200).json({
            status: 'success',
            token,
            message: 'User Registered successfully',
            user: {
                _id : user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        next(error)
    }
}