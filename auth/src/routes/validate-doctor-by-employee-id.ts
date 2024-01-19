import { ApiResponse, UserType, validateRequest } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
//import { EmployeeRoles } from '../models/create-role';
import { User } from '../models/user-auth';

const router = express.Router();

router.post(
	'/api/users/validatedoctor',
	[
		body('employeeId').trim()
			.notEmpty()
			.withMessage('Please provide employeeId')
	],
	validateRequest,

	async (req: Request, res: Response) => {

		const { employeeId } = req.body;
		let isPinSet = false;
		let isExistingDoctor = false;
		let doctorName = '';
		const user = await User.findOne({ employeeId: employeeId, userType: UserType.Doctor });
		if (user) {
			isExistingDoctor = true;
			if (user.pin !== 'NA') {
				isPinSet = true;
				doctorName = user.userFirstName + ' ' + user.userLastName;
			}
		}
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: { isExistingDoctor: isExistingDoctor, isPinSet, doctorName: doctorName }
		};
		res.send(apiResponse);

	});

export { router as findDoctorRouter };
