const admin = require('firebase-admin');
const User = require('../models/User'); // Your updated User model (with firebaseUid)

// Make sure Firebase Admin is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use cert
  });
}

// Protect routes
exports.protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
        //Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);

        //Fetch MongoDB user by firebaseUid
        const user = await User.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
        return res.status(401).json({ success: false, message: 'User not found in database' });
        }

        //Set full user object to req.user
        req.user = user;
  
      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
