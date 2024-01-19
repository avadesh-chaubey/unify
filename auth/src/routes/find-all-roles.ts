import { requireAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';
import { EmployeeRoles } from '../models/create-role';

const router = express.Router();

router.get(
	'/api/users/getuserroles',
	requireAuth,
	async (req: Request, res: Response) => {
		if (req.query && req.query.title) {
			let title = (req.query as any).title;
			let nameRegExp = new RegExp(title, 'i');
			const roles = await EmployeeRoles.find({ role: nameRegExp });
			let apiResponse: ApiResponse = {
				status: 200,
				message: 'Success',
				data: roles
			};
			res.send(apiResponse);
		}

		const roles = await EmployeeRoles.find({});

		let apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: roles
		};
		res.send(apiResponse);

	});

export { router as getUserRoles };
