const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  console.log('Auth middleware: Request headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('Auth middleware: No Authorization header');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Auth middleware: Extracted token:', token ? 'Token present' : 'No token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Decoded token:', decoded);
    
    // Fetch fresh user data from database
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('Auth middleware: User not found in database');
      return res.status(401).json({ msg: 'User not found' });
    }

    console.log('Auth middleware: User found:', user.email, 'with role:', user.role);
    
    req.user = {
      _id: user._id,
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (err) {
    console.log('Auth middleware: Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
