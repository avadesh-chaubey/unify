import express, { Request, Response } from 'express';
import { BadRequestError, ApiResponse, requireAuth } from '@unifycaredigital/aem';
import { Tag } from '../models/tag';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/cms/tag',
  requireAuth,
  async (req: Request, res: Response) => {

    let { tagName } = req.body;

    //checking if Tag already exists
    if (await Tag.find({ tagName: tagName }).count() > 0) {
      throw new BadRequestError("Tag already exists");
    }

    // Create a Tag  
    const tag = Tag.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      tagName: tagName
    });

    await tag.save();
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: tag
    };

    res.send(apiResponse);
  }
);

export { router as addTagRouter };
