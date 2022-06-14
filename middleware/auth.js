
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    //Check if not token
    if (!token) {
        return res.status(401).json({ msg: ' No Token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        if ( decoded.doctor) {
            req.user = decoded.doctor;
        }
        else if ( decoded.host) {
            req.user = decoded.host;
        }
        else {
            req.user = decoded.user;
        }
      
   
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: 'Token is not valid'})
    }
}