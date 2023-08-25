const { uploadBytes, ref, getDownloadURL } = require('firebase/storage');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');
const AppError = require('../utils/AppError');
const { transporter } = require('../utils/nodemailer');

exports.findAll = catchAsync(async (req, res, next) => {
  const users = await User.findAll({});

  return res.status(200).json({
    status: 'Success',
    results: users.length,
    users,
  });
});

exports.findOne = catchAsync(async (req, res, next) => {
  const { qrId } = req.params;

  const user = await User.findOne({
    where: {
      qrId: qrId,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`user with id: ${qrId} not found `, 404));
  }

  const imgRef = ref(storage, user.petImg);
  const url = await getDownloadURL(imgRef);

  user.petImg = url;

  return res.status(200).json({
    status: 'Success',
    user,
  });
});

exports.create = catchAsync(async (req, res) => {
  const {
    name,
    whatsapp,
    email,
    address,
    namePet,
    species,
    gender,
    race,
    age,
    sterilization,
    description,
  } = req.body;
  const { qrId } = req.params;

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const newUser = await User.create({
    qrId: qrId,
    name,
    whatsapp,
    email,
    address,
    namePet,
    species,
    gender,
    race,
    age,
    sterilization,
    description,
    petImg: imgUploaded.metadata.fullPath,
  });
  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: email, // Correo electrónico del usuario registrado
    subject: 'Registro Exitoso',
    text: `¡Gracias por registrarte! Tu usuario ha sido registrado exitosamente.
    sus datos:
    Nombre del Propetario: ${name},
    Correo Electronico: ${email},
    Numero de whatsapp: ${whatsapp},
    Dirección: ${address}
    
    Datos de la Mascota 

    Nombre de la mascota:${namePet},
    Especie: ${species},
    Sexo:${gender},
    Raza:${race},
    Edad: ${age},
    Esterilizado (a) : ${sterilization},
    Descripción: ${description}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });

  await transporter.sendMail(mailOptions);

  return res.status(200).json({
    status: 'success',
    message: 'The user has been created successfully!',
    user: newUser,
  });
});

exports.update = catchAsync(async (req, res) => {
  const {
    name,
    whatsapp,
    email,
    address,
    namePet,
    species,
    gender,
    race,
    age,
    sterilization,
    description,
    status,
  } = req.body;
  const { user } = req;

  await user.update({
    name,
    whatsapp,
    email,
    address,
    namePet,
    species,
    gender,
    race,
    age,
    sterilization,
    description,
    status,
  });

  return res.status(200).json({
    status: 'success',
    message: 'User information has been updated',
    user,
  });
});

exports.delete = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  return res.status(200).json({
    status: 'success',
    message: `The user with id: ${user.id} has been deleted`,
  });
});
