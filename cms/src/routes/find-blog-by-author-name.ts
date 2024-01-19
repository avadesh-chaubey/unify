import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Cms } from '../models/cms';


const router = express.Router();
// /api/cms/allblog?page=1
router.get(
  '/api/cms/blog/searchauthor/:authorName',
  requireAuth,
  async (req: Request, res: Response) => {

    //const authorName = req.query.authorName as string;
    const authorName = req.params.authorName

    const cms = await Cms.find({ authorName: authorName }).collation({ locale: "en", strength: 2 });

    if (cms.length === 0) {
      throw new BadRequestError("Blog with authorName: " + authorName + " not exists!");
    }
    //returning cms
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: cms
    };
    res.send(apiResponse);

  });

export { router as getBlogByAuthorName };