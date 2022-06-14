const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { validationResult, check } = require('express-validator');

const Host = require('../models/Host')

router.post('/', [
    check('name', 'Please add a name')
        .not()
        .isEmpty(),
    check('phone', 'Please add a name')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Please Enter a password with 6 or more characters')
        .isLength({
        min: 6
        }),
        check('address', 'Please add a Address')
        .not()
        .isEmpty(),
        check('description', 'Please enter a description')
        .not()
        .isEmpty(),
        check('nationalId', 'Please add a National ID')
        .not()
        .isEmpty(),
] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { name, phone, email, password, address, nationalId, description } = req.body;

    try {
        let host = await Host.findOne({ email }).select('-password  -__v');
        if (host) {
            return res.status(400).json({msg: 'Host already exists'})
        }
        let repeatedNationalId = await Host.findOne({ nationalId });;
        if (repeatedNationalId) {
            return res.status(400).json({msg: 'National ID already exists'})
        }
        host = new Host({
            name,
            phone,
            email,
            password,
            address,
            nationalId,
            description
        });

        const salt = await bcrypt.genSalt(10);

        host.password = await bcrypt.hash(password, salt);

        await host.save();

        const payload = {
            host: {
               id: host.id
           }
        }
        
        jwt.sign(payload, config.get('jwtSecret'), { 
            expiresIn:360000
        }, (err, token) => {
            if (err) throw err;
            res.json({token})
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

//get all hosts
router.get('/', async (req, res) => {
    try {
        const hosts = await Host.find().sort({ date: -1 }).select('-password  -__v')
        res.json(hosts)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});

//get host details
router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const host = await Host.findById(id, '-password  -__v').select('-password  -__v')
        res.json(host)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});

//update host
router.patch('/:id', async (req, res) => {
    const { id } = req.params
    console.log(id);
 
    try {
        const host = await Host.findOneAndUpdate(id,  req.body , { new: true }).select('-password  -__v')
        res.json(host)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});


module.exports = router