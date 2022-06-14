const mongoose = require('mongoose');

const DoctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        require: true
    },
    nationalId: {
        type: String,
        require: true
    },
    specilization: {
        type: String,
        require: true
    },
    availableDates: {
        type: Array,
        default: [Date],
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('doctor', DoctorSchema)