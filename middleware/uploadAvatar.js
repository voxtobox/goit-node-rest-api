import path from 'path';
import multer from 'multer';
import HttpError from '../helpers/HttpError.js';

const tempDir = path.resolve('temp');

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  limits: {
    fileSize: 1048576,
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(HttpError(400, 'Please, upload images only'), false);
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter: filter,
});
