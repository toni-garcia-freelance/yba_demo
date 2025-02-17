const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Authorization header:', req.header('Authorization'));

    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Token:', token);
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    
    // Find user
    const user = await User.findOne({ where: { id: decoded.userId } });
    console.log('User:', user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 