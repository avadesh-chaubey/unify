import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, ApiResponse } from '@unifycaredigital/aem';
import { Cms } from '../models/cms';

const router = express.Router();

router.delete(
  '/api/cms/blog/:blogId',
  requireAuth,
  async (req: Request, res: Response) => {

    const blogId = req.params.blogId;

    const count = await Cms.find({ blogId: blogId }).count();
    //checking if Blog exists

    if (await Cms.find({ blogId: blogId }).count() === 0) {
      throw new NotFoundError();
    }

    //deleting the blog

    await Cms.deleteOne({ blogId: blogId });
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data:  {message:"Blog with blogId " + blogId + " deleted successfully"} 
    };
    res.send(apiResponse);

  });

export { router as deleteBlogRouter };
