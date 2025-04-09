const axios = require('axios');
const admin = require('firebase-admin');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) =>{
  const { name, phoneNumber, email, password } = req.body;
  try {
    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber,
    });

    // 2. Save user to MongoDB
    const user = await User.create({
      firebaseUid: userRecord.uid,
      name,
      phoneNumber,
      email,
      role: 'user',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      uid: user.firebaseUid,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }  
};
  

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const firebaseRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { idToken, localId } = firebaseRes.data;

    res.status(200).json({
      success: true,
      token: idToken,
      uid: localId,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.response?.data?.error?.message || 'Invalid credentials',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private (requires protect middleware)
exports.getMe = async (req, res) => {
  try {
    const firebaseUser = req.user; // from middleware

    let user = await User.findOne({ firebaseUid: firebaseUser.uid });

    // Create if not found (optional)
    if (!user) {
      user = await User.create({
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.name || 'No Name',
        phoneNumber: firebaseUser.phoneNumber,
        email: firebaseUser.email,
        role: 'user',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Logout (informational only)
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout handled on client by removing Firebase token',
  });
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
  
    try {
      const firebaseRes = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_API_KEY}`,
        {
          requestType: 'PASSWORD_RESET',
          email,
        }
      );
  
      return res.status(200).json({
        success: true,
        message: `Password reset email sent to ${email}`,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.response?.data?.error?.message || 'Unable to send reset email',
      });
    }
  };
