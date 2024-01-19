import express from 'express';
import { storage } from '../storage-bucket';

const router = express.Router();

// Creates a client
router.get('/api/utility/download/:fileName', async (req,
  res) => {

  const bucketName = String(process.env.GCS_BUCKET);

  const fileName = req.params.fileName;

  storage.bucket(bucketName).file(fileName).createReadStream()
    .on('error', function (err) {
      console.log('error Called: ' + err);
    })
    .on('response', function (response) {
      // Server connected and responded with the specified status and headers.
      console.log('response Called: ' + response);
    })
    .on('end', function () {
      // The file is fully downloaded.
    })
    .pipe(res);

  res.status(200);
});

export { router as downloadFileRouter };