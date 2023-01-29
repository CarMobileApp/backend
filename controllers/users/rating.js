const Errors = require("../../errors");
const Models = require("../../utils/mongo").getModels();

module.exports.createRating = async (req, res, next) => {
  let data;
  const { rating, bookingId } = req.body;
  if (!rating || !bookingId)
    return next(Errors.invalidRequest("Please provide the required fields!"));

  try {
    const RatingModel = Models.rating;
    data = new RatingModel({
      rating: rating,
      bookingId: bookingId,
      userId: req.user._id,
    });

    data.save();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};
