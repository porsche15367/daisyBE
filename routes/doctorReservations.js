const express = require('express');
const router = express.Router()
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth')

const DoctorReservation = require('../models/DoctorReservation')

router.post('/', auth , [
    check('doctorId', 'Doctor Id is required')
        .not()
        .isEmpty(),
    check('reservationDate', 'Please select a date')
        .not()
        .isEmpty(),

] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { doctorId, reservationDate } = req.body;
    const clientId = req.user.id

    try {
        let reservation = await DoctorReservation.findOne({ reservationDate });
        if (reservation) {
            return res.status(400).json({msg: 'This date is already reserved'})
        }
        reservation = new DoctorReservation({
            doctorId,
            clientId,
            reservationDate
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
        const reservations = await DoctorReservation.find({ doctorId: req.user.id}).sort({ date: -1 })
        res.json(reservations)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }  
});
// //get all doctors
// router.get('/', async (req, res) => {
//     try {
//         const doctors = await Doctor.find('-password  -__v').sort({ date: -1 })
//         res.json(doctors)
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error')
//     }  
// });

// //get doctor details
// router.get('/:id', async (req, res) => {
//     const {id} = req.params
//     try {
//         const doctor = await Doctor.findById(id)
//         res.json(doctor)
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error')
//     }  
// });

// //update doctor
// router.patch('/:id', async (req, res) => {
//     const { id } = req.params
//     console.log(id);
 
//     try {
//         const doctor = await Doctor.findOneAndUpdate(id,  req.body , { new: true })
//         res.json(doctor)
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error')
//     }  
// });


module.exports = router