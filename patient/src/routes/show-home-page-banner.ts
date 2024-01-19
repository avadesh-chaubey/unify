import express, { Request, Response } from 'express';
import { requirePatientAuth, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';

const router = express.Router();

router.get('/api/patient/banner', requirePatientAuth, async (req: Request, res: Response) => {

  console.log(req.currentUser!.id);
  const members =
    [
      `https://storage.googleapis.com/${String(process.env.GCS_BUCKET)}/banner/banner1.png`,
      `https://storage.googleapis.com/${String(process.env.GCS_BUCKET)}/banner/banner2.png`,
      `https://storage.googleapis.com/${String(process.env.GCS_BUCKET)}/banner/banner3.png`
    ]
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: members
	  }
  res.send(apiResponse);
});

export { router as showPatientHomePageBannerRouter };
