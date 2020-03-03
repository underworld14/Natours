const multer = require('multer');
const AppErr = require('./appError');

// const usrImgStorage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename: function(req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     const uniqueSurfix = `img-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, uniqueSurfix);
//   }
// });

const multerStorage = multer.memoryStorage();

const ImgFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppErr('Not an Images', 400), false);
  }
};

const UserImgConfig = multer({
  storage: multerStorage,
  fileFilter: ImgFilter
});

const toursImgconfig = multer({
  storage: multerStorage,
  fileFilter: ImgFilter
});

exports.upUserImg = UserImgConfig.single('photo');
exports.upToursImg = toursImgconfig.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);
