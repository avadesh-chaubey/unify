import express, { Request, Response } from 'express';
import { validateRequest, BadRequestError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { EmployeeRoles } from '../models/create-role';
import { RolesAndPermissions } from '../models/assign-permissions';
import { body } from 'express-validator';

const router = express.Router();

router.post(
	'/api/users/createrole',
	requireAuth,
	[
		body('role').trim()
			.notEmpty()
			.withMessage('Role Should be passed as an Argument'),
		body('createdBy').trim()
			.notEmpty()
			.withMessage('CreatedBy Should be passed as an Argument'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		console.log('print current user', req.currentUser);
		const { role, isRoleEnabled, createdBy, updatedBy } = req.body;

		const checkRoleExists = await EmployeeRoles.findOne({ role });
		if (checkRoleExists) {
			throw new BadRequestError('Role already exists with ' + role);
		}
		const createRole = await EmployeeRoles.build({
			role,
			isRoleEnabled,
			createdBy,
			updatedBy,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		console.log('createRole-->', createRole);
		await createRole.save();
		let apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: createRole
		};
		res.send(apiResponse);
	}
);


export { router as createRoleRouter };