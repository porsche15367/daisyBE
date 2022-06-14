const express = require('express');
const connectDB = require('./config/db')

const cors = require('cors')
const app = express();

//connect Database
connectDB();

//Init Middleware
app.use(cors())
app.use( express.json({extended: false}) )

app.get('/', (req, res) => res.json({ msg: 'Welcome To the demo API' }))

//Define Routes
app.use('/api/users', require('./routes/users'))
app.use('/api/doctors', require('./routes/doctors'))
app.use('/api/doctorReservations', require('./routes/doctorReservations'))
app.use('/api/hostReservations', require('./routes/hostReservations'))
app.use('/api/hosts', require('./routes/hosts'))
app.use('/api/auth', require('./routes/auth'))

app.use(function(req, res) {
    // Invalid request
          res.status(404).json({
             message: 'Not found Api!'
          });
    });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
