import express, { Request, Response } from 'express';
import { requirePatientAuth,ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';

const router = express.Router();

router.get('/api/patient/familymembers', requirePatientAuth, async (req: Request, res: Response) => {

  //console.log(req.currentUser!.id);
  const members = await Patient.find({ parentId: req.currentUser!.id });

  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: members
  }
  res.send(apiResponse);
});

export { router as showAllFamilyMembersRouter };
