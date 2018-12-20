const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Allows to encrypt user password
const bcrypt = require('bcrypt');

//Allows to create tokens using json web token library
//https://github.com/auth0/node-jsonwebtoken#readme
const jwt = require('jsonwebtoken')

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1){
            return res.status(409).json({
                message: "Email altready exists"
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User Created!!"
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                message: "Auth Failed!!"
            })
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err){
                return res.status(401).json({
                    message: "Auth Failed!!"
                })
            }
            if (result){
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user._id
                    }, 
                    process.env.JWT_KEY, 
                   {
                       expiresIn: "1h"
                   } 
                )
                return res.status(200).json({
                    message: "Success Auth!!",
                    token: token
                })
            }
            return res.status(401).json({
                message: "Auth Failed!!"
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:userId', (req, res, next) => {
    User.findOneAndRemove({ _id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User Deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;