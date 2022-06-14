const express = require('express');
const router = express.Router()
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth')

const HostReservation = require('../models/HostReservation')

router.post('/', auth , [
    check('hostId', 'Doctor Id is required')
        .not()
        .isEmpty(),
    check('reservationDate', 'Please select a date')
        .not()
        .isEmpty(),
    check('kindOfPets', 'Please enter the kind of pets')
        .not()
        .isEmpty(),
    check('numberOfPets', 'Please enter the number of pets')
        .not()
        .isEmpty(),

] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { hostId, reservationDate, kindOfPets, numberOfPets } = req.body;
    const clientId = req.user.id

    try {
        reservation = new HostReservation({
            hostId,
            clientId,
            reservationDate,
            kindOfPets,
            numberOfPets
        });

        await reservation.save();
        res.json(reservation)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const reservations = await DoctorReservation.find({ hostId: req.user.id}).sort({ date: -1 })
        res.json(reservations)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});



module.exports = router