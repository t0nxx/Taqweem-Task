const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 300000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("avatar");

function checkFileType(file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    return cb(null, true);
  } else {
    cb("Error: jpg/png supported only");
  }
}

exports.upload = upload;
