import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, ApiResponse, UserType, BadRequestError } from '@unifycaredigital/aem';
import { User } from '../models/user-auth';
import bcrypt from 'bcrypt';
import { PhoneOTP } from '../models/phone-otp';


const router = express.Router();
const SALT_FACTOR = 10;

router.put(
  '/api/users/employeepin',
  [
    body('employeeId').trim().not().isEmpty().withMessage('employeeId is required'),
    body('pin').trim().not().isEmpty().withMessage('pin is required'),
    body('pin')
      .isLength({ min: 4, max: 4 })
      .withMessage('Pin must be 4 Digit'),
    body('token').not().isEmpty().withMessage('token is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    let { employeeId, pin, token } = req.body;

    const employee = await User.findOne({ employeeId: employeeId });

    if (employee && employee.userType !== UserType.Doctor) {
      throw new BadRequestError('Only Doctors can set Pin');
    }
    if (!employee) {
      throw new NotFoundError();
    }
    const phoneOTP = await PhoneOTP.findOne({ phoneNumber: employee.phoneNumber });
    if (!phoneOTP) {
      throw new BadRequestError('Invalid credentials');
    }

    if (phoneOTP.token !== token) {
      throw new BadRequestError('Invalid Token');
    }
    // generate a salt
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    if (salt) {

      //generate hash
      const hash = await bcrypt.hash(pin, salt);

      if (hash) {
        pin = hash;
        employee.set({
          pin: pin
        });
        await employee.save();
      }
    }

    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: 'Your PIN has been successfully updated.'
    }
    res.send(apiResponse);
  }
);

export { router as updateEmployeePinRouter };
