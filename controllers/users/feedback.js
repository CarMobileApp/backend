const Errors = require("../../errors");
const Models = require("../../utils/mongo").getModels();

module.exports.createFeedback = async (req, res, next) => {
  let data;
  const { feedback } = req.body;

  if (!feedback)
    return next(Errors.invalidRequest("Please provide the required fields!"));

  try {
    const FeedbackModel = Models.feedback;
    data = new FeedbackModel({
      feedback: feedback,
      userId: req.user._id,
    });

    data.save();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};
