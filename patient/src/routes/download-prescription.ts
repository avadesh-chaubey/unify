import express from 'express';
import { NotFoundError, requireAuth, BadRequestError, requirePatientAuth } from '@unifycaredigital/aem';
import { CaseSheet } from '../models/case-sheet';
import fs from 'fs';
import * as htmlPdf from 'html-pdf';
import { Appointment } from '../models/appointment-order';
import { app } from '../app';
import path from 'path';

import { Storage } from '@google-cloud/storage';

const router = express.Router();
// Creates a client
const storage = new Storage({ keyFilename: "key.json" });

router.get('/api/patient/download/prescription', async (req,
  res) => {

  if (req.query && req.query.appointmentId) {
    const appointmentId = req.query.appointmentId;
    const bucketName = String(process.env.GCS_BUCKET);

    const fileName = "appointment/" + appointmentId + ".pdf";

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
  } else {
    throw new BadRequestError("appointmentId mandetory");
  }
});


export { router as downloadPrescriptionRouter };