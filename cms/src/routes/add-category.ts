import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { Category } from '../models/category';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/cms/category',
  requireAuth,
  async (req: Request, res: Response) => {

    let { categoryName } = req.body;

    //checking if Category already exists
    if (await Category.find({ categoryName: categoryName }).count() > 0) {
      throw new BadRequestError("Category already exists");
    }
    // Create a Category 
    const category = Category.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      categoryName: categoryName
    });

    await category.save();
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: category
    };
    res.send(apiResponse);
  }
);

export { router as addCategoryRouter };
