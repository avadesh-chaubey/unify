import express, { Request, Response } from 'express';
import {
  validateRequest,
  requireRosterManagerAuth,
  NotFoundError,
  BadRequestError,
  ApiResponse
} from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import mongoose from 'mongoose';

import { DoctorProfile, DoctorProfileDoc } from '../models/doctor-profile';
import { VideoTag } from '../models/video-tag';

const router = express.Router();
// API to create new Doctor Profile using exisitng Details
router.post(
  '/api/partner/doctorprofile',
  requireRosterManagerAuth,
  validateRequest,
  async (req: Request, res: Response) => {

    let {
      id,
      rating,
      experienceList,
      awardAndRecognitionImageUrlList,
      //awardAndRecognitionsList,
      videoTagList,
      newArticleList,
      linkedInProfileUrl,
      facebookProfileUrl,
      podcastWorkshopUrl,
      podcastWorkshopButtonCaption,
      about,
      profileImageName,
      testimonials
    } = req.body;


    let doctorProfile: DoctorProfileDoc;

    const taggedVideoList = await VideoTag.find({});
    const thisDoctorTags: [string] = [""];
    thisDoctorTags.pop();
    taggedVideoList.forEach((v :any) => {
      if (v.doctorIdList.indexOf(id) !== -1) {
        //this will push video id
        thisDoctorTags.push(v.id);
      }
    });

    let existingDoctor = await PartnerEmployee.findById(id);
    if (existingDoctor) {
      const existingDoctorProfile = await DoctorProfile.findOne({ $or: [{ uniqueId: existingDoctor!.uniqueId }, { uniqueId: id }] });
      if (existingDoctorProfile) {
        throw new BadRequestError("Doctor Profile already exists!");
      }
    }
    if (existingDoctor) {
      doctorProfile = DoctorProfile.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        doctorFullName: existingDoctor.userFirstName + " " + existingDoctor.userLastName,
	    uniqueId : existingDoctor.uniqueId,
        profileImageName: profileImageName ? profileImageName : existingDoctor.profileImageName,
        rating: rating ? 0 : rating,
        specializationList: existingDoctor.qualificationList,
        experinceInYears: existingDoctor.experinceInYears,
        qualificationList: existingDoctor.qualificationList,
        about: about ? about : existingDoctor.about,
        superSpeciality: existingDoctor.superSpeciality,
        experienceList: experienceList ? experienceList : "",
        awardAndRecognitionImageUrlList: awardAndRecognitionImageUrlList ? awardAndRecognitionImageUrlList : "",
        //awardAndRecognitionsList: awardAndRecognitionsList,
        videoUrlList: thisDoctorTags,
        videoTagList: videoTagList,
        newArticleList: newArticleList,
        linkedInProfileUrl: linkedInProfileUrl,
        facebookProfileUrl: facebookProfileUrl,
        podcastWorkshopUrl: podcastWorkshopUrl,
        podcastWorkshopButtonCaption: podcastWorkshopButtonCaption,
        testimonials: testimonials
      });
      await doctorProfile.save();
    } else {
      throw new NotFoundError();
    }
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: doctorProfile
    }
    res.send(apiResponse);
  }
);

export { router as createDoctorProfileRouter };
