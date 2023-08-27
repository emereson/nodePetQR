const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/AppError');
const Admin = require('../models/admin.model');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const admin = await Admin.create({
    name,
    email,
    password: encryptedPassword,
  });

  const token = await generateJWT(admin.id);

  res.status(201).json({
    status: 'success',
    message: 'the admin has ben created successfully!',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({
    where: {
      email,
      status: 'active',
    },
  });
  if (!admin) {
    return next(new AppError('the user could not be found', 404));
  }

  if (!(await bcrypt.compare(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(admin.id);

  res.status(201).json({
    status: 'success',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  });
});

exports.generateQRCode = catchAsync(async (req, res, next) => {
  const qrCodes = [];
  const numCodes = 50; // Número de códigos QR que deseas generar

  for (let i = 0; i < numCodes; i++) {
    const uuid = uuidv4();
    const registrationUrl = `https://aquiestoyconqr.com/#/user/registerPe/${uuid}`;

    const qrCodeDataUrl = await qrcode.toDataURL(registrationUrl);

    qrCodes.push(qrCodeDataUrl);
  }

  res.status(201).json({
    status: 'success',
    qrCodes,
  });
});

exports.findAll = catchAsync(async (req, res, next) => {
  const admins = await Admin.findAll({
    where: {
      status: 'active',
    },
  });

  return res.status(200).json({
    status: 'Success',
    results: admins.length,
    admins,
  });
});

exports.findOne = catchAsync(async (req, res, next) => {
  const { admin } = req;

  return res.status(200).json({
    status: 'Success',
    admin,
  });
});

exports.delete = catchAsync(async (req, res) => {
  const { admin } = req;

  await admin.update({ status: 'disabled' });

  return res.status(200).json({
    status: 'success',
    message: `The user with id: ${admin.id} has been deleted`,
  });
});
