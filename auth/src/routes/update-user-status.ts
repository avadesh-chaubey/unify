import express, { Request, Response } from 'express';
import { requireAuth, UserStatus, ApiResponse, NotAuthorizedError } from '@unifycaredigital/aem';
import { UserAdmin } from '../models/user-admin';
import { body } from 'express-validator';

const router = express.Router();

router.put(
    '/api/users/updateuserstatus',
    requireAuth,
    [
        body('emailId').trim()
            .notEmpty()
            .withMessage('emailId to be passed as an Argument')
    ],
    async (req: Request, res: Response) => {
        const { emailId, userStatus } = req.body;

        console.log('isRoleActive -->', emailId)
        const user = await UserAdmin.findOne({ emailId });
        // @TODO: Update a Role
        if (user && user.userStatus != UserStatus.Unverified) {
            const updatedUserList = await UserAdmin.findOneAndUpdate({ emailId }, {
                $set: {
                    userStatus: userStatus
                }
            }, { new: true });
            let apiResponse: ApiResponse = {
                status: 200,
                message: 'Success',
                data: updatedUserList!
            };
            res.send(apiResponse);
        } else {
            throw new NotAuthorizedError();
        }
    }
);


export { router as updateUserStatusRouter };
