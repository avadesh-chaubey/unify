import express, { Request, Response } from 'express';
import { requireRosterManagerAuth, NotFoundError, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentTimeTable } from '../models/appointment-time-table';

const router = express.Router();

router.get(
  '/api/appointment/slotstimetable/:consultantId',
  requireRosterManagerAuth,
  async (req: Request, res: Response) => {

    let existingAppointmentTimeTable = await AppointmentTimeTable.findOne({
      consultantId: req.params.consultantId,
    });
    if (!existingAppointmentTimeTable) {
      throw new NotFoundError();
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: existingAppointmentTimeTable
    };

    res.status(200).send(apiResponse);
  }
);

export { router as viewAppointmentTimeTableRouter };
