const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/AppError');
const Admin = require('../models/admin.model');

exports.protect = catchAsync(async (req, res, next) => {
  //1. extraer el token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //2. validar si existe el token
  if (!token) {
    return next(
      new AppError('You are not logged in!, Please log in to get access', 401)
    );
  }

  //3. decodificar el jwt
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  //4. buscar el usuario y validar si existe
  const admin = await Admin.findOne({
    where: {
      id: decoded.id,

      status: 'active',
    },
  });

  console.log(admin);

  if (!admin) {
    return next(
      new AppError('The owner of this token it not longer available', 401)
    );
  }
  req.sessionAdmin = admin;
  next();
});

exports.validExistAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const admin = await Admin.findOne({
    where: {
      status: 'active',
      id,
    },
  });

  if (!admin) {
    return next(new AppError(`gallery not found`, 404));
  }

  req.admin = admin;
  next();
});
