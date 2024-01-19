import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';

const router = express.Router();

router.put(
  '/api/partner/image',
  requireAuth,
  async (req: Request, res: Response) => {

    const {
      profileImageName,
    } = req.body;

    const employee = await PartnerEmployee.findById(req.currentUser!.id);

    if (!employee) {
      throw new NotFoundError();
    }

    employee.set({
      profileImageName,
    });

    await employee.save();
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: employee
    }
    res.send(apiResponse);
   
  }
);

export { router as updateSelfProfileImageRouter };
