import { NotFoundError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';

import mongoose from 'mongoose';
import { ArticleTag } from '../models/article-tag';
import { DoctorProfile } from '../models/doctor-profile';

const router = express.Router();

router.post(
  '/api/partner/tagarticle',
  requireAuth,
  async (req: Request, res: Response) => {

    let {
      id,
      description,
      doctorIdList,
      url
    } = req.body;

    const tagArticleId = new mongoose.Types.ObjectId().toHexString();
    let doctorIds: any = [];
    //Restricting duplicate doctorprofile ids
    doctorIdList.forEach((id: string) => {
      if (doctorIds.indexOf(id) === -1) {
        doctorIds.push(id);
      }
    });
    if (id) {
      const articleTag = await ArticleTag.findById(id);
      if (!articleTag) {
        throw new NotFoundError();
      }

      articleTag.set({
        id: id,
        description: description,
        doctorIdList: doctorIds,
        url: url,
        date: articleTag.date
      });
      doctorIds.forEach(async (d: string) => {
        const doctorProfile = await DoctorProfile.findById(d);
        const newArticleList = doctorProfile?.newArticleList;
        if (newArticleList?.indexOf(d) === -1) {
          newArticleList?.push(id);
        }
        console.log("tagArticleId: " + tagArticleId);
        if (doctorProfile) {
          if (doctorProfile.newArticleList.indexOf(id) === -1) {
            doctorProfile.set({
              newArticleList: newArticleList
            })
            await doctorProfile.save();
          }
        }
      });
      await articleTag.save();
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: articleTag
      }
      res.send(apiResponse);
    } else {

      doctorIds.forEach(async (d: string) => {
        console.log("d: " + d);
        const doctorProfile = await DoctorProfile.findById(d);
        console.log("doctorProfile: " + doctorProfile);
        const newArticleList = doctorProfile?.newArticleList;
        if (newArticleList?.indexOf(d) === -1) {
          newArticleList?.push(tagArticleId);
        }
        console.log("tagArticleId: " + tagArticleId);
        if (doctorProfile) {
          doctorProfile.set({
            tagArticleId: tagArticleId
          });
          await doctorProfile.save();
        }
      });

      const articleTag = ArticleTag.build({
        id: tagArticleId,
        desription: description,
        doctorIdList: doctorIds,
        url: url,
        date: new Date()
      });
      await articleTag.save();
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: articleTag
      }
      res.send(apiResponse);
    }

  });

export { router as createArticleTagRouter };
