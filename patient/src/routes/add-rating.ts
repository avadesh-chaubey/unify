import express, { Request, Response } from 'express';
import { requirePatientAuth, BadRequestError, requireAuth, ApiResponse } from '@unifycaredigital/aem';

import mongoose from 'mongoose';

import { ratingTable } from '../models/rating';


const router = express.Router();

router.post(
    '/api/patient/addrating',
    requireAuth,
    async (req: Request, res: Response) => {

        let { userId, appointmentId, rating, comment, revisit , eventCompletionCheck} = req.body;

        
        const ratingDoc = ratingTable.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            userId : userId,
            appointmentId :appointmentId ,
            rating :rating,
            comment :comment,
            revisit :revisit,
            eventCompletionCheck : eventCompletionCheck,
            reviewAt : new Date()
        });
        await ratingDoc.save();

		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: document
		}
        res.send(apiResponse);
    }
);

export { router as addRating };
