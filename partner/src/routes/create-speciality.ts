import express, { Request, Response } from 'express';
const router = express.Router();
import { Speciality } from '../models/speciality';
import mongoose from 'mongoose';
import { ApiResponse,BadRequestError } from '@unifycaredigital/aem';

router.post(
	'/api/partner/speciality',
	async (req: Request, res: Response) => {
		const {specialityName,specialityDescription,organisationUID} = req.body;

		  let speciality = await Speciality.findOne({specialityName : specialityName,organisationUID:organisationUID});

		  if (speciality) {
		    	throw new BadRequestError('Partner already Exist with Same Corporate ID');
		  } else {
			const id = new mongoose.Types.ObjectId().toHexString();
			  speciality = Speciality.build({
			  id: id,
			  specialityName: specialityName,
			  specialityDescription: specialityDescription,
			  organisationUID: organisationUID,
			});
			await speciality.save();
		  }
		  const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: speciality
		  }
		  res.send(apiResponse);
		}
	  );

export { router as createSpecialityRouter };