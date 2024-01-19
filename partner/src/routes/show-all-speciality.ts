import express, { Request, Response } from 'express';
const router = express.Router();
import { Speciality } from '../models/speciality'
import { ApiResponse } from '@unifycaredigital/aem';

router.get(
	'/api/partner/speciality',
	async (req: Request, res: Response) => {
		const ownerOrganisationUID = req.query.ownerOrganisationUID as any;
		if (ownerOrganisationUID) {
			const speciality = await Speciality.find({ organisationUID: ownerOrganisationUID });
			const apiResponse : ApiResponse= {
				status: 200,
				message: 'Success',
				data: speciality
			};
			res.send(apiResponse)
		}
		else {
			const speciality = await Speciality.find({});
			const apiResponse : ApiResponse = {
				status: 200,
				message: 'Success',
				data: speciality
			};
			res.send(apiResponse)
		}
	});

export { router as showAllSpecialityRouter };