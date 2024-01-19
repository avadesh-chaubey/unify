import express, { Request, Response } from 'express';
import {
  UserType,
  requireRosterManagerAuth,
  NotFoundError,
  BadRequestError,
  ApiResponse
} from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import { ConsultantInfoUpdatedPublisher } from '../events/publishers/consultant-info-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import { User } from '../models/user';

const router = express.Router();

router.put(
  '/api/partner/employee',
  requireRosterManagerAuth,
  async (req: Request, res: Response) => {

    let {
      id,
      title,
      userFirstName,
      userMiddleName,
      userLastName,
      genderType,
      languages,
      dateOfBirth,
      experinceInYears,
      qualificationList,
      department,
      specialization,
      profileImageName,
      designation,
      panNumber,
      panUrl,
      address,
      city,
      state,
      country,
      pin,
      addressProofNumber,
      addressProofUrl,
      doctorRegistrationNumber,
      phoneNumber,
      avaiability,
      activeFrom,
      activeTill,
      employeeId,
      uniqueId,
      organization,
      superSpeciality,
      userId,
      password,
      about,
      feeDetails,
      organizationUID,
      specialityUID

    } = req.body;

    const employee = await PartnerEmployee.findById(id);
    if (!employee) {
      throw new NotFoundError();
    }
    if (phoneNumber && employee.phoneNumber !== phoneNumber) {

      let existingPhoneNumber = await PartnerEmployee.findOne({ phoneNumber: phoneNumber });
      if (existingPhoneNumber) {
        throw new BadRequestError('Phone Number already in use');
      }

      const existingPhone = await User.findOne({ phoneNumber: phoneNumber });
      if (existingPhone) {
        throw new BadRequestError('Phone Number already in use');
      }
    }

    employee.set({
      id,
      title,
      userFirstName: title + " " + userFirstName,
      userMiddleName,
      userLastName,
      partnerId: req.currentUser!.fid,
      genderType: genderType,
      dateOfBirth: dateOfBirth,
      experinceInYears: experinceInYears,
      qualificationList: qualificationList,
      department: department,
      specialization: specialization,
      profileImageName: profileImageName,
      designation: designation,
      languages: languages,
      panNumber: panNumber,
      panUrl: panUrl,
      address: address,
      city: city,
      state: state,
      country: country,
      pin: pin,
      phoneNumber: phoneNumber ? phoneNumber : employee.phoneNumber,
      addressProofNumber: addressProofNumber,
      addressProofUrl: addressProofUrl,
      doctorRegistrationNumber: String(doctorRegistrationNumber),
      avaiability: avaiability,
      activeFrom: activeFrom,
      activeTill: activeTill,
      employeeId: employeeId,
      uniqueId: uniqueId,
      organization: organization,
      superSpeciality: superSpeciality,
      userId: userId,
      password: password,
      about: about,
      feeDetails: feeDetails,
      organizationUID: organizationUID,
      specialityUID: specialityUID
    });
    await employee.save();
    //TODO: update phone number in firebase also
    // if (phoneNumber && employee.phoneNumber !== phoneNumber) {
    //   firebase
    //     .auth()
    //     .UpdateUser({
    //       uid: id,
    //       email: employee.emailId,
    //       phoneNumber: "+91" + phoneNumber,
    //       emailVerified: true,
    //       password: employee.emailId,
    //       displayName: userFirstName + " " + userLastName,
    //       disabled: false,
    //     })
    //     .then((userRecord: any) => {
    //       // See the UserRecord reference doc for the contents of userRecord.
    //       console.log('Successfully Updated the user:', userRecord.uid);
    //     })
    //     .catch((error: any) => {
    //       console.log('Error Updating the user:', error);
    //       throw new BadRequestError(`Unable to Update user! ${error}`);
    //     });
    // }
    //TODO Merge both messages in One
    if (employee.userType !== UserType.PartnerRosterManager) {
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
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: employee
    };

    res.send(apiResponse);
  }
);

export { router as updatePartnerEmployeeRouter };
