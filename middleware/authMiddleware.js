import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

const devProtect = asyncHandler(async (req, res, next) => {
  // Replace with a real user ID from your DB (any non-admin will do for testing)
  const testUserId = '686cf4657c6100c1d2e83726';

  const user = await User.findById(testUserId).select('-password');

  if (!user) {
    res.status(401);
    throw new Error('User not found in devProtect');
  }

  req.user = user;
  next();
});

// Protect routes
const protect = asyncHandler( async (req, res, next ) => {
    let token;

    // Check if cookies are present and read the JWT from the cookie
    if(req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(token) {
        try{
            // verify the token
            const decoded = jwt.verify( token, process.env.JWT_SECRET);
            // fetch the user from database
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            // proceed to next middleware
            next();
        } catch (error){
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed:' + error.message);
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});


// Admin middleware
const admin = (req, res, next)  => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorised as an Admin');
    }
};

export { devProtect, protect, admin };