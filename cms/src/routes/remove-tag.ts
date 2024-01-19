import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Tag } from '../models/tag';

const router = express.Router();

router.delete(
  '/api/cms/tag/:id',
  requireAuth,
  async (req: Request, res: Response) => {

    let tagId = req.params.id;

    //checking if Tag with id exists
    if (await Tag.countDocuments({ _id: tagId }) === 0) {
      throw new BadRequestError("Tag with id " + tagId + " not exists");
    }

    // Deleting a Tag 
    await Tag.deleteOne({ _id: tagId });

    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data:  {message:"Tag deleted successfully!"} 
    };
    res.send(apiResponse);
  }
);

export { router as deleteTagRouter };
