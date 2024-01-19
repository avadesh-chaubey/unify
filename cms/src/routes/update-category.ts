import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Category } from '../models/category';


const router = express.Router();

router.put(
  '/api/cms/category',
  requireAuth,
  async (req: Request, res: Response) => {

    let { id, categoryName } = req.body;

    //checking if Category with id exists
    if (await Category.countDocuments({ _id: id }) === 0) {
      throw new BadRequestError("Category with id " + id + " not exists");
    }

    // Updating a Category  
    await Category.updateOne({ _id: id },
      {
        $set: { categoryName: categoryName }
      });

      let apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data:  {message:"Category updated successfully!"} 
      };
      res.send(apiResponse);
  }
);

export { router as updateCategoryRouter };
