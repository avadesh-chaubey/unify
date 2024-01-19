import express, { Request, Response } from 'express';
import { NotFoundError, BadRequestError, requireAuth } from '@unifycaredigital/aem';
import { Cms } from '../models/cms';
import moment from 'moment';
import { ApiResponse } from '@unifycaredigital/aem';

const router = express.Router();
// /api/cms/blog?page=1&size=4&isPublished=1
router.get(
  '/api/cms/blog',
  // requireAuth,
  async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as any);
    //const PAGE_SIZE = 10;
    const PAGE_SIZE = parseInt(req.query.size as any);
    const startDate = req.query.startDate as any;
    const endDate = req.query.endDate as any;
    const publishedFlag = parseInt(req.query.isPublished as any);
    const sort = req.query.sort;
    var query: any = {};
    query.skip = PAGE_SIZE * (page - 1);
    query.limit = PAGE_SIZE;
    const accessKey = req.query.accessKey;

    if (page <= 0) {
      throw new NotFoundError();
    }

    if (req.query && req.query.startDate && req.query.endDate) {
      if (!moment(startDate, 'YYYY-MM-DD', true).isValid()) {
        throw new BadRequestError("Date Format should be YYYY-MM-DD");
      }
      // check endDate formed as required
      if (!moment(endDate, 'YYYY-MM-DD', true).isValid()) {
        throw new BadRequestError("Date Format should be YYYY-MM-DD");
      }
      //Make sure only endDate must be earlier than startDate 
      if (!moment(endDate).isSameOrAfter(moment(startDate))) {
        throw new BadRequestError("startDate must be date before endDate");
      }
      const sDate = moment(startDate).utcOffset(330).format('DD MMM YYYY');
      const eDate = moment(endDate).utcOffset(330).format('DD MMM YYYY');
      const totalBlogs = await Cms.countDocuments({ blogPublishedDate: { $gte: sDate, $lte: eDate } });
      if (sort == "asc") {
        const cms = await Cms.find({
          blogPublishedDate: { $gte: sDate, $lte: eDate }
        }, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1, content: 1, action: 1 }, query).sort({ [`${accessKey}`]: 1 }).collation({ locale: "en", caseLevel: true })
        let apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: { "totalBlogs": totalBlogs, "cms": cms }
        };
        res.send(apiResponse);
      } else {
        const cms = await Cms.find({
          blogPublishedDate: { $gte: sDate, $lte: eDate }
        }, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1, content: 1, action: 1 }, query).sort({ [`${accessKey}`]: -1 }).collation({ locale: "en", caseLevel: true })
        let apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: { "totalBlogs": totalBlogs, "cms": cms }
        };
        res.send(apiResponse);
      }
    }
    else if (req.query && req.query.sort) {
      const totalBlogs = await Cms.countDocuments({});
      if (sort == "asc") {
        const cms = await Cms.find({}, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1, content: 1, action: 1 }, query).sort({ [`${accessKey}`]: 1 }).collation({ locale: "en", caseLevel: true })
        let apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: { "totalBlogs": totalBlogs, "cms": cms }
        };
        res.send(apiResponse);
      }
      else {
        const cms = await Cms.find({
        }, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1, content: 1, action: 1 }, query).sort({ [`${accessKey}`]: -1 }).collation({ locale: "en", caseLevel: true })
        let apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: { "totalBlogs": totalBlogs, "cms": cms }
        };
        res.send(apiResponse);
      }
    }
    else {
      const totalBlogs = await Cms.countDocuments({});
      const cms = await Cms.find({}, { _id: 1, title: 1, authorName: 1, blogPublishedDate: 1, blogPublishedTime: 1, titleImageUrl: 1, blogId: 1, isPublished: 1, categories: 1, tags: 1, metaDescription: 1, publishedDate: 1, buttonCaption: 1, sorting: 1, content: 1, action: 1 }, query).sort({ publishedDate: -1 });
      let apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: { "totalBlogs": totalBlogs, "cms": cms }
      };
      res.send(apiResponse);
    }

  });

export { router as getAllBlog }