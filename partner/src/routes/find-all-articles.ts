import { requireAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';
import { ArticleTag } from '../models/article-tag';



const router = express.Router();

router.get(
  '/api/partner/tagarticle',
  requireAuth,
  async (req: Request, res: Response) => {

    const tags = await ArticleTag.find({});
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: tags
    }
    res.send(apiResponse);

  });

export { router as findArticleTagRouter };

