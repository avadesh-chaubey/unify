import express from 'express';
import { FileStorage } from '../model/file-storage';
import { BadRequestError, requireAuth, FileType, ApiResponse } from '@unifycaredigital/aem'
import multer from 'multer';
import MulterGoogleCloudStorage from 'multer-google-storage';
import mongoose from 'mongoose';

const router = express.Router();

const uploadHandler = multer({
  storage: new MulterGoogleCloudStorage()
});

router.post('/api/utility/upload', requireAuth, uploadHandler.single('file'), async (req,
  res, next) => {

  if (!req.file) {
    throw new BadRequestError('No file uploaded.');
  }

  const id = new mongoose.Types.ObjectId().toHexString();
  console.log("fileName: "+req.file.filename);
  console.log("mimetype: "+req.file.mimetype);
  console.log("destination: "+req.file.destination);
  console.log("originalname: "+req.file.originalname);
  console.log("path: "+req.file.path);
  console.log("size: "+req.file.size);


  const newFile = FileStorage.build({
    id,
    userId: req.currentUser!.id,
    userType: req.currentUser!.uty,
    partnerId: req.currentUser!.fid,
    fileType: FileType.ANY,
    fileName: req.file.filename,
  });
  await newFile.save();

  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: newFile
  }

  res.send(apiResponse);

});

export { router as uploadFileRouter };