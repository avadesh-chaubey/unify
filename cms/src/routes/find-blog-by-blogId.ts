import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Cms } from '../models/cms';

const router = express.Router();
// /api/cms/allblog?page=1
router.get(
  '/api/cms/blog/:blogId',
  requireAuth,
  async (req: Request, res: Response) => {

    const blogId = req.params.blogId;
    const cms = await Cms.findOne({ blogId: blogId });
    if (cms === null) {
      throw new BadRequestError("Blog with blogId: " + blogId + " not exists!");
    }
    //returning cms
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: cms
    };
    res.send(apiResponse);

  });

export { router as getBlogByBlogId };