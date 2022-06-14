const mongoose = require('mongoose');

const HostReservationSchema = mongoose.Schema({
    hostId: {
        type: mongoose.Schema.ObjectId,
        ref: "Host",
        required:[true,"Reservation must belong a host"]
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
    kindOfPets: {
        type: String,
        require: true
    },
    numberOfPets: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('hostReservation', HostReservationSchema)