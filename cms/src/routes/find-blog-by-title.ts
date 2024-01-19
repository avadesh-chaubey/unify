import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { Cms } from '../models/cms';


const router = express.Router();
// /api/cms/allblog?page=1
router.get(
  '/api/cms/blog/searchtitle',
  requireAuth,
  async (req: Request, res: Response) => {
    let title: string = "";
    const page = parseInt(req.query.page as any);
    const PAGE_SIZE = parseInt(req.query.size as any);
    const sort = req.query.sort;
    const accessKey = req.query.accessKey;
    var query: any = {};
    query.skip = PAGE_SIZE * (page - 1);
    query.limit = PAGE_SIZE;
    if (req.query && req.query.title) {
      title = (req.query as any).title;
      const nameRegExp = new RegExp(title, 'i');
      const totalBolog = await Cms.countDocuments({ title: nameRegExp });
      // const blog = await Cms.find({ title: nameRegExp }, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1}, query);
      if (sort == "asc") {
        const blog = await Cms.find({
          title: nameRegExp
        }, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1, action: 1 }, query).sort({ [`${accessKey}`]: 1 }).collation({ locale: "en", caseLevel: true })
        let apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: { "totalBlogs": totalBolog, "cms": blog }
        };
        res.send(apiResponse);
      } else {
        const blog = await Cms.find({
          title: nameRegExp
        }, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1, action: 1 }, query).sort({ [`${accessKey}`]: -1 }).collation({ locale: "en", caseLevel: true })
        let apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: { "totalBlogs": totalBolog, "cms": blog }
        };
        res.send(apiResponse);
      }
    }
    else {
      throw new BadRequestError("Please provide a valid title");
    }

  });

export { router as getBlogByTitle };