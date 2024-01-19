import express, { Request, Response } from 'express';
import { requirePatientAuth, BadRequestError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { PatientDocument } from '../models/patient-document';


const router = express.Router();

router.post(
    '/api/patient/addpatientdocument',
    requireAuth,
    async (req: Request, res: Response) => {

        let { title, category, date, url, patientId ,fileType} = req.body;

        // Create a Patient
        const document = PatientDocument.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: title,
            category: category,
            date: date,
            url: url,
            uploadDate: new Date(),
            patientId: patientId,
            fileType:fileType
        });
        await document.save();

		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: document
		}
        res.send(apiResponse);
    }
);

export { router as addPatientDocumentRouter };
