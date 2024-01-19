import { requireAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';

import { VideoTag } from '../models/video-tag';


const router = express.Router();

// API to get all tagvideo
router.get(
  '/api/partner/tagvideo',
  requireAuth,
  async (req: Request, res: Response) => {

    const tags = await VideoTag.find({});
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: tags
    }
    res.send(apiResponse);

  });

export { router as findvideoTagRouter };
