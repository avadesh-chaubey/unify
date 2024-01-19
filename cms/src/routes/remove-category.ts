import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Category } from '../models/category';


const router = express.Router();

router.delete(
  '/api/cms/category/:id',
  requireAuth,
  async (req: Request, res: Response) => {

    let categoryId = req.params.id;

    //checking if Category with id exists
    if (await Category.countDocuments({ _id: categoryId }) === 0) {
      throw new BadRequestError("category with id " + categoryId + " not exists");
    }

    // Deleting a category
    await Category.deleteOne({ _id: categoryId });
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data:  {message:"Category deleted successfully!"} 
    };
    res.send(apiResponse);
  }
);

export { router as deleteCategoryRouter };
