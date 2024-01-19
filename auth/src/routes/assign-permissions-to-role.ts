import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, BadRequestError, ApiResponse } from '@unifycaredigital/aem'
import { RolesAndPermissions } from '../models/assign-permissions';
import { EmployeeRoles } from '../models/create-role';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
//import { RolesAndPermissionPublisher } from '../events/publishers/roles-and-permission-publisher';

const router = express.Router();

router.post(
	'/api/users/assignrolepermissions',
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
		const { role, roleEditIds, roleViewIds, createdBy, updatedBy } = req.body;

		const checkRoleExists = await EmployeeRoles.findOne({ role });

		if (!checkRoleExists) {
			throw new BadRequestError('Role doesnt exists, Please create the role & assign permissions');
		}

		const rolepermission = await RolesAndPermissions.findOne({ role });
		if (rolepermission) {
			throw new BadRequestError('Permissions already assigned');
		}

		const assignRole = await RolesAndPermissions.build({
			id: new mongoose.Types.ObjectId().toHexString(),
			role,
			roleEditIds,
			roleViewIds,
			createdBy,
			updatedBy,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		console.log('assignRole-->', assignRole);
		await assignRole.save();

		//new RolesAndPermissionPublisher(natsWrapper.client).publish({
		//	id: assignRole._id,
		//	role: assignRole.role,
		//	roleEditIds: assignRole.roleEditIds,
		//	roleViewIds: assignRole.roleViewIds,
		//	createdBy: assignRole.createdBy,
		//	updatedBy: assignRole.updatedBy,
		//	createdAt: assignRole.createdAt,
		//	updatedAt: assignRole.updatedAt
		//});
		let apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: assignRole
		};
		res.send(apiResponse);
	}
);


export { router as assignPermissionToRoleRouter };
