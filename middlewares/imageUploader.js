const multer = require('multer');

const imageStorage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const uploader = multer({storage: imageStorage});
module.exports = uploader