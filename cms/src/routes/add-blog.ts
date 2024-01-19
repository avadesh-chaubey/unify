import express, { Request, Response } from 'express';
import { Cms } from '../models/cms';
import mongoose from 'mongoose';
import moment from 'moment';
import { requireAuth, ApiResponse } from '@unifycaredigital/aem';

const router = express.Router();

router.post(
  '/api/cms/blog',
  requireAuth,
  async (req: Request, res: Response) => {

    let
      {
        id,
        blogId,
        title,
        metaKeywords,
        metaDescription,
        seoUrl,
        titleImageUrl,
        content,
        categories,
        tags,
        authorName,
        isPublished,
        buttonCaption,
        sorting,
        publishOnHomePage,
      } = req.body;

    let cms;

    //checking whether blogId is undefined
    //blogId !== undefined
    cms = await Cms.findOne({ blogId: blogId }).count();
    if (cms > 0) {

      // Create a Cms 
      cms = Cms.build({
  id: id,
  blogId: blogId,
  title: title,
  metaKeywords: metaKeywords,
  metaDescription: metaDescription,
  seoUrl: seoUrl,
  titleImageUrl: titleImageUrl,
  content: content,
  categories: categories,
  tags: tags,
  authorName: authorName,
  isPublished: isPublished,
  publishedDate: moment().utcOffset(330).format("YYYY-MM-DD HH:mm"),
  blogPublishedDate: moment().utcOffset(330).format('DD MMM YYYY'),
  blogPublishedTime: moment().utcOffset(330).format('LTS'),
  buttonCaption: buttonCaption,
  sorting: sorting,
  publishOnHomePage: publishOnHomePage,
  action: false
});

      // Updating the blog
      await Cms.updateOne({ blogId: cms.blogId }, {
        $set: {
          title: cms.title,
          metaKeywords: cms.metaKeywords,
          buttonCaption: cms.buttonCaption,
          sorting: cms.sorting,
          metaDescription: cms.metaDescription,
          seoUrl: cms.seoUrl,
          titleImageUrl: cms.titleImageUrl,
          content: cms.content,
          categories: cms.categories,
          tags: cms.tags,
          authorName: cms.authorName,
          isPublished: cms.isPublished,
          publishedDate: cms.publishedDate,
          blogPublishedDate: moment().utcOffset(330).format('DD MMM YYYY'),
          blogPublishedTime: moment().utcOffset(330).format('LTS'),
          publishOnHomePage: publishOnHomePage,

        }
      });

    } else {

      // Create a Cms 
      cms = Cms.build({
  id: new mongoose.Types.ObjectId().toHexString(),
  blogId: new mongoose.Types.ObjectId().toHexString(),
  title: title,
  metaKeywords: metaKeywords,
  metaDescription: metaDescription,
  seoUrl: seoUrl,
  titleImageUrl: titleImageUrl,
  content: content,
  categories: categories,
  tags: tags,
  authorName: authorName,
  isPublished: isPublished,
  publishedDate: moment().utcOffset(330).format("YYYY-MM-DD HH:mm"),
  blogPublishedDate: moment().utcOffset(330).format('DD MMM YYYY'),
  blogPublishedTime: moment().utcOffset(330).format('LTS'),
  buttonCaption: buttonCaption,
  sorting: sorting,
  publishOnHomePage: publishOnHomePage,
  action: false
});

      await cms.save();

    }
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: cms
    };
    //returning cms
    res.send(apiResponse);

  });

export { router as addBlogRouter };
