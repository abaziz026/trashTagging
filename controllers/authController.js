require('dotenv').config();
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    //check if email already exists.
    if (await User.findOne({ email })) {
      res.status(400).json({
        status: 'Bad Request',
        message: 'User with this email already exists.please try another email'
      });
    }
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        newUser
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'server error',
      message: 'something went wrong please try again later.'
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      res.status(400).json({
        status: 'bad request',
        message: 'Please provide email and password!'
      });
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        status: 'unauthorized',
        message: 'Incorrect email or password'
      });
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'server error',
      message: 'something went wrong please try again later.'
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        status: 'unauthorized',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        status: 'unauthorized',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'server error',
      message: 'something went wrong please try again later.'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', etc]. role='user'
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'Access Denied',
        message: 'You do not have permission to perform this action.'
      });
    }

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  let user;
  try {
    // 1) Get user based on POSTed email
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({
        status: 'not found',
        message: 'There is no user with email address.'
      });
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    //we are turning off the validations because if all the required field is not specified
    //user.save() method will not work
    await user.save({ validateBeforeSave: false });

    // 3) Send reset url to the user
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}`;

    res.status(200).json({
      status: 'success',
      message: message
    });
  } catch (error) {
    console.log(user);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(error);
    res.status(500).json({
      status: 'server error',
      message: 'something went wrong please try again later.'
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token issued to the user
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    //checking the token and expiry time of the token.
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      res.status(400).json({
        status: 'Bad Request',
        message: 'Token is invalid or expired.'
      });
    }
    user.password = req.body.password;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'password reset please login'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'server error',
      message: 'something went wrong please try again later.'
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      res.status(401).json({
        status: 'unauthorized',
        message: 'Your current password is wrong.'
      });
    }

    // 3) If so, update password
    user.password = req.body.password;

    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    res.status(200).json({
      status: 'success',
      message: 'you have successfully updated the password.'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'server error',
      message: 'something went wrong please try again later.'
    });
  }
};
