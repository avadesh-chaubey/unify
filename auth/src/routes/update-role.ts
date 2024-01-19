import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, ApiResponse } from '@unifycaredigital/aem';
import { EmployeeRoles } from '../models/create-role';
import { body } from 'express-validator';

const router = express.Router();

router.put(
    '/api/users/updaterole',
    requireAuth,
    [
        body('role').trim()
            .notEmpty()
            .withMessage('Role Should be passed as an Argument'),
        body('isRoleEnabled')
            .notEmpty()
            .withMessage('isRoleEnabled Flag needs to be available'),
        body('updatedBy')
            .notEmpty()
            .withMessage('updatedBy Field needs to be passed as a string argument'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { role, isRoleEnabled, updatedBy } = req.body;

        const updatedRole = await EmployeeRoles.findOneAndUpdate({ role }, {
            $set: {
                isRoleEnabled,
                updatedBy
            }
        }, { new: true });
        let apiResponse: ApiResponse = {
            status: 200,
            message: 'Success',
            data: updatedRole!
        };
        res.send(apiResponse);
    }
);


export { router as updateRoleRouter };