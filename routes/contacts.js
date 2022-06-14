const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { validationResult, check } = require('express-validator');

const User = require('../models/User')
const Contact = require('../models/Contact');

router.get('/', auth, async (req, res) => {
      try {
          const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 })
          res.json(contacts)
      } catch (error) {
          console.error(error.message);
          res.status(500).send('Server Error')
      }  
});

router.post('/', [auth, [
    check('name', 'Name is required')
        .not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { name, email, phone, type } = req.body;
    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });

        const contact = await newContact.save()
        res.json(contact)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
    
});

router.patch('/:id', [auth, [
    check('name', 'Name is required')
        .not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const updates = req.body;
    try {
        const id = req.params.id
        const result = await Contact.findByIdAndUpdate(id, updates)  
        res.json(result)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
    
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await Contact.deleteOne({_id:id})  
        res.json({
            msg: "Deleted Successfully"
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router