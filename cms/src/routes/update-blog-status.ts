import express, { Request, Response } from 'express';
import { Cms } from '../models/cms';
import mongoose from 'mongoose';
import { requireAuth, ApiResponse, NotFoundError, validateRequest } from '@unifycaredigital/aem';
import { body } from 'express-validator';

const router = express.Router();

router.put(
  '/api/cms/updateblogstatus',
  requireAuth,
  [
    body('blogId').not().isEmpty().withMessage('blogId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let {
      blogId,
      action
    } = req.body;

    const cmsStatus = await Cms.findOne({ blogId });
    if (!cmsStatus) {
      throw new NotFoundError();
    }
    cmsStatus.set({
      action
    });
    await cmsStatus.save();
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: cmsStatus
    }
    res.send(apiResponse);
  }
);

export { router as updateCmsBlogStatusRouter };
