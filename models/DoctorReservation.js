const mongoose = require('mongoose');

const DoctorReservationSchema = mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
        required:[true,"Reservation must belong a doctor"]
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:[true,"Reservation must belong a client"]
    },
    reservationDate: {
        type: Date,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('doctorReservation', DoctorReservationSchema)