const { getDownloadURL, ref, uploadBytes } = require('firebase/storage');
const Sponsor = require('../models/sponsor.model');
const catchAsync = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');

exports.findAll = catchAsync(async (req, res, next) => {
  const sponsors = await Sponsor.findAll({
    where: {
      status: 'active',
    },
  });

  const sponsorPromises = sponsors.map(async (sponsor) => {
    const imgRef = ref(storage, sponsor.sponsorImg);
    const url = await getDownloadURL(imgRef);
    sponsor.sponsorImg = url;
    return sponsor;
  });

  const userResolved = await Promise.all(sponsorPromises);

  return res.status(200).json({
    status: 'success',
    results: sponsors.length,
    sponsors: userResolved,
  });
});

exports.findOne = catchAsync(async (req, res, next) => {
  const { sponsor } = req;

  const imgRef = ref(storage, sponsor.sponsorImg);
  const url = await getDownloadURL(imgRef);

  sponsor.sponsorImg = url;

  return res.status(200).json({
    status: 'success',
    sponsor,
  });
});

exports.create = catchAsync(async (req, res) => {
  const { name, description, whatssap, email, phone, facebook } = req.body;

  const imgRef = ref(storage, `sponsor/${Date.now()}-${req.file.originalname}`);
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const sponsor = await Sponsor.create({
    name,
    description,
    whatssap,
    email,
    phone,
    facebook,
    sponsorImg: imgUploaded.metadata.fullPath,
  });
  return res.status(200).json({
    status: 'success',
    message: 'the sponsor has been created successfully!',
    sponsor,
  });
});

exports.update = catchAsync(async (req, res) => {
  const { name, description, whatssap, email, phone, facebook, status } =
    req.body;
  const { sponsor } = req;

  await sponsor.update({
    name,
    description,
    whatssap,
    email,
    phone,
    facebook,
    status,
  });

  return res.status(200).json({
    status: 'success',
    message: 'sponsor information has been updated',
    sponsor,
  });
});

exports.delete = catchAsync(async (req, res) => {
  const { sponsor } = req;

  await sponsor.update({ status: 'disabled' });
  return res.status(200).json({
    status: 'success',
    message: `The sponsor with id: ${user.id} has been deleted`,
  });
});
