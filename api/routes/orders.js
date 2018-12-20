const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ckeckAuth = require('../middleware/check-auth')

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', ckeckAuth, (req, res, next) =>{
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(orders => {
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return{
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request_url: {
                        type: 'GET',
                        url: 'http:localhost:3000/orders/' + order._id
                    }
                }
            })
            
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});

router.post('/', ckeckAuth, (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product){
            res.status(500).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        order.save()
        .then(result => {
            res.status(201).json({
                message: 'Order stored!!',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request_url: {
                    type: 'GET',
                    url: 'http:localhost:3000/orders/' + result._id
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Product not found',
            error: err
        })
    })
});

router.get('/:orderId', ckeckAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if (!order){
            return res.status(404).json({
                message: 'Order not found!!'
            })
        }
        res.status(200).json({
            order : order,
            request_url: {
                type: 'GET',
                url: 'http:localhost:3000/orders/'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
});

router.delete('/:orderId', ckeckAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.findOneAndRemove({
        _id: id
    })
    .exec()
    .then(result => {
        res.status(201).json({
            message: "Order Deleted Successfuly",
            request_url: {
                type: 'POST',
                url: 'http:localhost:3000/orders/',
                data: {
                    quantity: 'Number',
                    productId: 'String'
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;