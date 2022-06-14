const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth')
const { validationResult, check } = require('express-validator');

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Host = require('../models/Host');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').exists()
] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        let userInfo = await User.findOne({ email }).select('-password  -__v')
     
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
    
        const payload = {
            user: {
               id: user.id
           }
        }
        jwt.sign(payload, config.get('jwtSecret'), { 
            expiresIn:360000
        }, (err, token) => {
            if (err) throw err;
            res.json({token,  userInfo })
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});
router.post('/doctor', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').exists()
] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let doctor = await Doctor.findOne({ email })
        let doctorInfo = await Doctor.findOne({ email }).select('-password  -__v')
        if (!doctor) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            doctor: {
               id: doctor.id
           }
        }
        
        jwt.sign(payload, config.get('jwtSecret'), { 
            expiresIn:360000
        }, (err, token) => {
            if (err) throw err;
            res.json({token, doctorInfo})
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});
router.post('/host', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').exists()
] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let host = await Host.findOne({ email })
        let hostInfo = await Host.findOne({ email }).select('-password  -__v')
        if (!host) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, host.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            host: {
               id: host.id
           }
        }
        
        jwt.sign(payload, config.get('jwtSecret'), { 
            expiresIn:360000
        }, (err, token) => {
            if (err) throw err;
            res.json({token, hostInfo})
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router