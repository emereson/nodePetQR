const Sponsor = require('../models/sponsor.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.validExistSponsor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sponsor = await Sponsor.findOne({
    where: {
      status: 'active',
    },
  });

  if (!sponsor) {
    return next(new AppError(`sponsor with id: ${id} not found`, 404));
  }
  req.user = sponsor;
  next();
});

exports.validExistSponsorPatch = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sponsor = await Sponsor.findOne({
    where: {
      id: id,
    },
  });

  if (!sponsor) {
    return next(new AppError(`sponsor with id: ${id} not found`, 404));
  }
  req.sponsor = sponsor;
  next();
});
