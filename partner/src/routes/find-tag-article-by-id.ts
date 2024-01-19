import { requireAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';
import { ArticleTag } from '../models/article-tag';

const router = express.Router();

router.get(
  '/api/partner/tagarticle/:id',
  requireAuth,
  async (req: Request, res: Response) => {

    const tag = await ArticleTag.findById(req.params.id);
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: tag!
    }
    res.send(apiResponse);

  });

export { router as findArticleTagByIdRouter };
