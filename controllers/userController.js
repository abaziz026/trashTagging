const multer = require('multer');

const sharp = require('sharp');
const User = require('./../models/userModel');

const AppError = require('./../util/appError');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  } catch (error) {
    console.log(error);
    next(new AppError(error, 500));
  }
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.log(error);
    if (!result) {
      res.status(404).json({
        status: 'error',

        message: 'No document found with that ID'
      });
    } else {
      res.status(500).json({
        status: 'error',
        data: error
      });
    }
  }
};

exports.getUser = async (req, res, next) => {
  let result;
  try {
    let query = User.findById(req.params.id);

    result = await query;

    res.status(200).json({
      status: 'success',
      data: {
        data: result
      }
    });
  } catch (error) {
    if (!result) {
      res.status(404).json({
        status: 'error',

        message: 'No document found with that ID'
      });
    } else {
      res.status(500).json({
        status: 'error',

        data: {
          error: error
        }
      });
    }
  }
};

exports.getAllUsers = async (req, res, next) => {
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const size = req.query.size ? parseInt(req.query.size) : 10;
  let result;
  try {
    let query = User.find()
      .skip(offset)
      .limit(size);

    result = await query;

    res.status(200).json({
      status: 'success',
      data: {
        data: result
      }
    });
  } catch (error) {
    if (!result) {
      res.status(404).json({
        status: 'error',

        message: 'No document found'
      });
    } else {
      res.status(500).json({
        status: 'error',

        data: {
          error: error
        }
      });
    }
  }
};

// Do NOT update passwords with this!
exports.updateUser = async (req, res, next) => {
  let result;
  try {
    result = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        data: result
      }
    });
  } catch (error) {
    if (!result) {
      res.status(404).json({
        status: 'error',

        message: 'No document found with that ID'
      });
    } else {
      res.status(500).json({
        status: 'error',

        data: {
          error: error
        }
      });
    }
  }
};

exports.deleteUser = async (req, res, next) => {
  let result;
  try {
    result = await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'User successfully Deleted.'
    });
  } catch (error) {
    console.log(error);
    if (!result) {
      res.status(404).json({
        status: 'error',

        message: 'No document found with that ID'
      });
    } else {
      res.status(500).json({
        status: 'error',
        data: error
      });
    }
  }
};
