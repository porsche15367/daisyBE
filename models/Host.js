const mongoose = require('mongoose');

const HostSchema = mongoose.Schema({
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
        required: true
    },
    nationalId: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        unique: true
    },

    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('host', HostSchema)