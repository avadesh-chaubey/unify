import express, { Request, Response } from 'express';
import { requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { Category } from '../models/category';


const router = express.Router();

router.get(
  '/api/cms/category',
  requireAuth,
  async (req: Request, res: Response) => {
    const categories = await Category.find();
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: categories
    };
    res.send(apiResponse);
  }
);

export { router as allCategoryRouter };
