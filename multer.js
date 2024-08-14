const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'public'));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime().toString() + (Math.random() + 1).toString(36).replace('.','') + path.extname(file.originalname));
  }
});

 const upload = multer({ storage: storage });
module.exports = upload
