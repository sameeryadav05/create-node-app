import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ExpressError from '../utils/ExpressError.js';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ExpressError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new ExpressError(401, 'User not found');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(new ExpressError(401, 'Not authorized, token failed'));
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new ExpressError(403, 'Not authorized as an admin'));
  }
};
