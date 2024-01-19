import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, ApiResponse } from '@unifycaredigital/aem';
import { RolesAndPermissions } from '../models/assign-permissions';
import fs from 'fs'
import path from 'path'

const router = express.Router();

router.get(
	'/api/users/getassignrolepermissions',
	requireAuth,
	[
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const role = req.query.role as any;

		const rolesandpermission = await RolesAndPermissions.findOne({ role: role });

		if (!rolesandpermission) {
			//throw new BadRequestError("Role not exist");
			let apiResponse: ApiResponse = {
				status: 200,
				message: 'Failure',
				data: 'Role does not exist'
			};
			res.send(apiResponse)
		}
		else {

			let roleViewIds: [Number] = rolesandpermission.roleViewIds;
			let roleEditIds: [Number] = rolesandpermission.roleEditIds;

			let permissionJsonFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../interfaces/manageRole&Permissions.json'), 'utf8'));

			const rolesObj: any = []
			for (let i = 0; i < permissionJsonFile.length; i++) {
				let permissionObj = permissionJsonFile[i];
				rolesObj.push(permissionObj)
				let sectionObj = permissionObj.sections;
				let rObj = permissionJsonFile[i];
				roleViewIds.forEach(element => {
					if (element == rObj.id) {
						rObj.viewChecked = true;
					}
				})
				roleEditIds.forEach(element => {
					if (element == rObj.id) {
						rObj.editChecked = true;
					}
				})
				if (typeof sectionObj === "undefined") {
					let accessTypeObj = permissionObj.accessTypes;
					if (typeof accessTypeObj !== "undefined") {
						for (let k = 0; k < accessTypeObj.length; k++) {
							let rObj = accessTypeObj[k];
							roleViewIds.forEach(element => {
								if (element == rObj.id) {
									rObj.viewChecked = true;
								}
							})
							roleEditIds.forEach(element => {
								if (element == rObj.id) {
									rObj.editChecked = true;
								}
							})
						}
					}
				} else {
					let sLen = sectionObj.length;
					for (let j = 0; j < sLen; j++) {
						let rObj = sectionObj[j];
						roleViewIds.forEach(element => {
							if (element == rObj.id) {
								rObj.viewChecked = true;
							}
						})
						roleEditIds.forEach(element => {
							if (element == rObj.id) {
								rObj.editChecked = true;
							}
						})
						let aObj = sectionObj[j].accessTypes;
						for (let k = 0; k < aObj.length; k++) {
							let rObj = aObj[k];
							roleViewIds.forEach(element => {
								if (element == rObj.id) {
									rObj.viewChecked = true;
								}
							});
							roleEditIds.forEach(element => {
								if (element == rObj.id) {
									rObj.editChecked = true;
								}
							})
						}
					}
				}
			}
			const roleData = { _id: rolesandpermission._id, role: rolesandpermission.role, roleEditIds: rolesandpermission.roleEditIds, roleViewIds: rolesandpermission.roleViewIds, permissions: rolesObj }
			let apiResponse: ApiResponse = {
				status: 200,
				message: 'Success',
				data: roleData
			};
			res.send(apiResponse);
		}
	}
);

export { router as getAssignPermissionToRoleRouter };
