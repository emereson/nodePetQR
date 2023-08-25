const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.validExistUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      status: 'active',
      id: id,
    },
  });

  if (!user) {
    return next(new AppError(`user with id: ${id} not found `, 404));
  }

  req.user = user;
  next();
});

exports.validExistId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    return next(new AppError(`user with id: ${id} not found `, 404));
  }

  req.user = user;
  next();
});
