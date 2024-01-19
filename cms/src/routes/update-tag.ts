import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Tag } from '../models/tag';


const router = express.Router();

router.put(
  '/api/cms/tag',
  requireAuth,
  async (req: Request, res: Response) => {

    let { id, tagName } = req.body;

    //checking if Tag with id exists
    if (await Tag.countDocuments({ _id: id }) === 0) {
      throw new BadRequestError("Tag with id " + id + " not exists");
    }

    // Updating a Tag  
    await Tag.updateOne({ _id: id },
      {
        $set: { tagName: tagName }
      });

      let apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data:  {message:"Tag was updated successfully!"} 
      };
      res.send(apiResponse);
  }
);

export { router as updateTagRouter };
