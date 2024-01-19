import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireRosterManagerAuth
  , UserType, NotFoundError, BadRequestError,
  validateRequest
} from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import mongoose from 'mongoose';
import { ConsultantInfoUpdatedPublisher } from '../events/publishers/consultant-info-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/partner/consultationcharge',
  requireRosterManagerAuth,
  [
    body('consultantId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Consultant Id must be provided'),],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      consultantId,
      consultationCharge,
      locationBasedFeeConfig,
    } = req.body;

    const employee = await PartnerEmployee.findById(consultantId);

    if (!employee) {
      throw new NotFoundError();
    }
    var locationBasedFeeConfigList: string[] = [];
    for (let i = 0; i < locationBasedFeeConfig.length; i++) {
      locationBasedFeeConfigList.push(locationBasedFeeConfig[i].locationConfig);
    }

    //getDuplicateArrayElements
    var sorted_arr = locationBasedFeeConfigList.slice().sort();
    var results = [];
    for (var i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] === sorted_arr[i]) {
        //found duplicate
        throw new BadRequestError(`Cannot add duplicate elements in the list?`);
      }
    }





    if (employee.userType == UserType.Doctor
      || employee.userType == UserType.Dietician
      || employee.userType == UserType.Educator) {

      employee.set({
        consultationChargesInINR: consultationCharge,
        locationBasedFeeConfig: locationBasedFeeConfig
      });
      employee.markModified('locationBasedFeeConfig');
      await employee.save();

      //TODO Merge both messages in One
      new ConsultantInfoUpdatedPublisher(natsWrapper.client).publish({
        id: employee.id!,
        userFirstName: employee.userFirstName,
        userMiddleName: employee.userMiddleName,
        userLastName: employee.userLastName,
        emailId: employee.emailId,
        phoneNumber: employee.phoneNumber,
        partnerId: employee.partnerId,
        userStatus: employee.userStatus,
        userType: employee.userType,
        dateOfBirth: employee.dateOfBirth,
        experinceInYears: employee.experinceInYears,
        qualificationList: employee.qualificationList,
        department: employee.department,
        specialization: employee.specialization,
        profileImageName: employee.profileImageName,
        designation: employee.designation,
        city: employee.city,
        state: employee.state,
        country: employee.country,
        pin: employee.pin,
        languages: employee.languages,
        consultationChargesInINR: employee.consultationChargesInINR,
        genderType: employee.genderType,
        doctorRegistrationNumber: employee.doctorRegistrationNumber,
        locationBasedFeeConfig: employee.locationBasedFeeConfig,
        about: employee.about
      });

      const apiResponse = {
        status: 200,
        message: 'Success',
        data: employee
      }
      res.send(apiResponse);
    } else {
      throw new BadRequestError("Employee type is not consultant");
    }
  }
);

export { router as updateConsultationChargesRouter };
