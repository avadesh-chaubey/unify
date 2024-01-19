import { requireAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';

import { VideoTag } from '../models/video-tag';

const router = express.Router();

router.get(
  '/api/partner/tagvideo/:id',
  requireAuth,
  async (req: Request, res: Response) => {

    const tag = await VideoTag.findById(req.params.id);
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: tag!
    }
    res.send(apiResponse);

  });

export { router as findvideoTagByIdRouter };
