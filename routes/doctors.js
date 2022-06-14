const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { validationResult, check } = require('express-validator');

const Doctor = require('../models/Doctor')

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
        check('nationalId', 'Please add a National ID')
        .not()
        .isEmpty(),
        check('availableDates', 'Please add Available Dates')
        .not()
        .isEmpty(),
        check('specilization', 'Please add Specilization')
        .not()
        .isEmpty(),
] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { name, phone, email, password, address, nationalId, availableDates,specilization  } = req.body;

    try {
        let doctor = await Doctor.findOne({ email });
        if (doctor) {
            return res.status(400).json({msg: 'Doctor already exists'})
        }
        let repeatedNationalId = await Doctor.findOne({ nationalId });;
        if (repeatedNationalId) {
            return res.status(400).json({msg: 'National ID already exists'})
        }
        doctor = new Doctor({
            name,
            phone,
            email,
            password,
            address,
            nationalId,
            availableDates,
            specilization
        });

        const salt = await bcrypt.genSalt(10);

        doctor.password = await bcrypt.hash(password, salt);

        await doctor.save();

        jwt.sign(payload, config.get('jwtSecret'), { 
            expiresIn:360000
        }, (err, token) => {
            if (err) throw err;
            res.json({token, doctor})
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

//get all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ date: -1 }).select('-password  -__v')
        res.json(doctors)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});

//get doctor details
router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const doctor = await Doctor.findById(id).select('-password  -__v')
        res.json(doctor)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});

//update doctor
router.patch('/:id', async (req, res) => {
    const { id } = req.params
    console.log(id);
 
    try {
        const doctor = await Doctor.findOneAndUpdate(id,  req.body , { new: true }).select('-password  -__v')
        res.json(doctor)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});


module.exports = router