import express, { Request, Response } from 'express';
import { requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { Tag } from '../models/tag';

const router = express.Router();

router.get(
  '/api/cms/tag',
  requireAuth,
  async (req: Request, res: Response) => {
    const tags = await Tag.find();
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: tags
    };
    res.send(apiResponse);
  }
);

export { router as allTagRouter };
