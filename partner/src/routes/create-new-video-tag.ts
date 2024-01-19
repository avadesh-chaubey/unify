import { NotFoundError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';

import mongoose from 'mongoose';
import { DoctorProfile } from '../models/doctor-profile';
import { VideoTag } from '../models/video-tag';


const router = express.Router();

router.post(
  '/api/partner/tagvideo',
  requireAuth,
  async (req: Request, res: Response) => {

    let {
      id,
      name,
      doctorIdList,
      url
    } = req.body;

    const tagVideoId = new mongoose.Types.ObjectId().toHexString();

    let doctorIds: any = [];
    //Restricting duplicate doctorprofile ids
    doctorIdList.forEach((id: string) => {
      if (doctorIds.indexOf(id) === -1) {
        doctorIds.push(id);
      }
    });
    if (id) {
      const videoTag = await VideoTag.findById(id);
      if (!videoTag) {
        throw new NotFoundError();
      }

      videoTag.set({
        id: id,
        name: name,
        doctorIdList: doctorIdList,
        url: url,
        date: videoTag.date
      });
      doctorIdList.forEach(async (d: string) => {
        const doctorProfile = await DoctorProfile.findById(d);
        const videoUrlList = doctorProfile?.videoUrlList;
        if (videoUrlList?.indexOf(d) === -1) {
          videoUrlList?.push(id);
        }
        console.log("tagVideoId: " + tagVideoId);
        if (doctorProfile) {
          if (doctorProfile.videoUrlList.indexOf(id) === -1) {
            doctorProfile.set({
              videoUrlList: videoUrlList
            })
            await doctorProfile.save();
          }
        }
      });
      await videoTag.save();
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: videoTag
      }
      res.send(apiResponse);
    } else {

      doctorIds.forEach(async (d: string) => {
        console.log("d: " + d);
        const doctorProfile = await DoctorProfile.findById(d);
        console.log("doctorProfile: " + doctorProfile);
        const videoUrlList = doctorProfile?.videoUrlList;
        if (videoUrlList?.indexOf(d) === -1) {
          videoUrlList?.push(tagVideoId);
        }
        console.log("tagVideoId: " + tagVideoId);
        if (doctorProfile) {
          doctorProfile.set({
            videoUrlList: videoUrlList
          });
          await doctorProfile.save();
        }
      });

      const videoTag = VideoTag.build({
        id: tagVideoId,
        name: name,
        doctorIdList: doctorIdList,
        url: url,
        date: new Date()
      });
      await videoTag.save();
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: videoTag
      }
      res.send(apiResponse);
    }

  });

export { router as createvideoTagRouter };
