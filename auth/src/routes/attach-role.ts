import express, { Request, Response } from 'express';
import { requireAuth, CustomError, validateRequest, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { UserAdmin } from '../models/user-admin';
import { body } from 'express-validator';
import { EmployeeRoles } from '../models/create-role';

const router = express.Router();

router.post(
	'/api/users/attachrole',
	requireAuth,
	[
		body('role').trim()
			.notEmpty()
			.withMessage('Role Should be passed as an Argument'),
		body('roleAssignedBy').trim()
			.notEmpty()
			.withMessage('Role AssignedBy Should be passed as an Argument'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const { role, emailId, roleAssignedBy } = req.body;
			const roleAssignedDate = new Date();

			const checkRoleExists = await EmployeeRoles.findOne({ role });
			if (!checkRoleExists) {
				throw new BadRequestError('Role doesnt exists, Please create the role & attach the role');
			}

			const updatedRole = await UserAdmin.updateMany({ emailId }, {
				$set: {
					role,
					isRoleActive: false,
					roleAssignedBy,
					roleAssignedDate
				}
			}, { new: true });
			let apiResponse: ApiResponse = {
				status: 200,
				message: 'Success',
				data: 'Role updated successfully!'
			};
			res.send(apiResponse);
		} catch (err) {
			console.log(err);
			throw new Error('Exception Occurred While Attaching the Role')
		}
	}
);


export { router as attachEmployeeRoleRouter };