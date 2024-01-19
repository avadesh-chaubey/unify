import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { RolesAndPermissions } from '../models/assign-permissions';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
//import { RolesAndPermissionUpdatedPublisher } from '../events/publishers/roles-and-permission-updated-publisher';
const router = express.Router();

router.put(
    '/api/users/updateassignrolepermissions',
    requireAuth,
    [
        body('role').trim()
            .notEmpty()
            .withMessage('Role Should be passed as an Argument'),
        body('updatedBy').trim()
            .notEmpty()
            .withMessage('UpdatedBy Should be passed as an Argument'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { role, roleEditIds, roleViewIds, updatedBy } = req.body;


        //const partnerID = req.currentUser!.fid;

        const rolesandpermission = await RolesAndPermissions.findOne({ role });

        if (!rolesandpermission) {
            throw new BadRequestError("Role not exist");
        }

        rolesandpermission.set({
            role,
            roleEditIds,
            roleViewIds,
            updatedBy,
            updatedAt: new Date()
        });

        //new RolesAndPermissionUpdatedPublisher(natsWrapper.client).publish({
        //    id: rolesandpermission._id,
        //    role: rolesandpermission.role,
        //    roleEditIds: rolesandpermission.roleEditIds,
        //    roleViewIds: rolesandpermission.roleViewIds,
        //    createdBy: rolesandpermission.createdBy,
        //    updatedBy: rolesandpermission.updatedBy,
        //    createdAt: rolesandpermission.createdAt,
        //    updatedAt: rolesandpermission.updatedAt
        //});
        await rolesandpermission.save();


        let apiResponse: ApiResponse = {
            status: 200,
            message: 'Success',
            data: rolesandpermission
        };
        res.send(apiResponse);
    }
);

export { router as updateAssignPermissionToRoleRouter };
