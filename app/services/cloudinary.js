const { dataUri } = require("../middleware/multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { uploader } = require("../../config/cloudinary.config");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const imageFileFilter = (file) =>
  file.mimetype === "image/png" ||
  file.mimetype === "image/jpg" ||
  file.mimetype === "image/JPG" ||
  file.mimetype === "image/jpeg";

const uploadImageSingle = asyncHandler(async (req, res, next) => {
  if (req.file) {
    console.log(req.file);
    if (imageFileFilter(req.file)) {
      const file = dataUri(req).content;
      console.log("--reached 1--");
      const result = await uploader.upload(file, {
        public_id: `${req.user.username}-${Date.now()}`,
      });
      return result.url;
    } else {
      return next(
        new ErrorResponse(
          "Invalid file format. Only .png, .jpg and .jpeg formats are allowed!",
          400
        )
      );
    }
  } else {
    return next(new ErrorResponse("No file sent", 400));
  }
});

module.exports = {
  uploadImageSingle,
};
