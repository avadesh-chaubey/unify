import express, { Request, Response } from "express";
import { body } from "express-validator";
import { InternalServerError, requireAuth, validateRequest, ApiResponse } from "@unifycaredigital/aem";
import { storage } from '../storage-bucket';

const router = express.Router();

// Creates a client
router.post(
  "/api/utility/renamefile", requireAuth,
  [
    body("oldFileName").not().isEmpty().withMessage("Medicine type is required"),
    body("newFileName").not().isEmpty().withMessage("Medicine Name is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const bucketName = String(process.env.GCS_BUCKET);

    const { oldFileName, newFileName } = req.body;

    await storage.bucket(bucketName).file(oldFileName).rename(newFileName)
      .catch((error) => {
        console.error(error);
        throw new InternalServerError();
      });
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: 'OK'
	  }
    res.send(apiResponse);
  });

export { router as renameFileRouter };