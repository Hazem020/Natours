const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split('/')[1];
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') cb(null, true);
  else cb(new AppError('Not an image! Please upload only images.', 400), false);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: 'success', results: users.length, data: users });
});
exports.getUser = (req, res) => {
  const id = req.params.ID;
  const user = '';
  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({ status: 'success', data: { user } });
};

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    user: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.password || req.passwordConfirm)
    return next(new AppError("You can't change Password"), 400);
  const data = { name: req.body.name, email: req.body.email };
  if (req.file) data.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

exports.deteleMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    status: 'success',
  });
});
exports.addUser = (req, res) => res.status(500);

exports.deleteUser = factory.deleteOne(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
