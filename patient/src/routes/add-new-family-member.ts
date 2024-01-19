import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, validateRequest, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import mongoose from 'mongoose';
import { FamilyMemberCreatedPublisher } from '../events/publishers/family-member-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { body } from 'express-validator';
import moment from 'moment';
import { PartnerInformation } from '../models/partner-information';

const router = express.Router();

// /api/patient/addfamilymember?patientId=
router.post(
    '/api/patient/addfamilymember',
    requireAuth,
    [
        body("userFirstName").not().isEmpty().withMessage("userFirstName is required"),
        //  body("userLastName").not().isEmpty().withMessage("userLastName is required"),
        body("gender").not().isEmpty().withMessage("gender is required"),
        body("dateOfBirth").not().isEmpty().withMessage("dateOfBirth is required"),
        body("userMotherName").not().isEmpty().withMessage("userMotherName is required")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        let {
            userFirstName,
            userMiddleName,
            userLastName,
            dateOfBirth,
            gender,
            phoneNumber,
            userMotherName,
            relationship,
            ownerOrganisationUID,
            mhrId,
            languages,
            address,
            address2,
            area,
            city,
            state,
            country,
            pin,
            profileImageName
        } = req.body;

        //getting dob in YYYY-MM-DD format
        if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
            throw new BadRequestError("DOB Format should be YYYY-MM-DD");
        }
        //Make sure only same day or past dateOfBirth consider as valid. 
        if (!moment(dateOfBirth).isSameOrBefore(moment().utcOffset(330).format('YYYY-MM-DD'))) {
            throw new BadRequestError("DOB Cannot be of future date");
        }
        //Restricting registration for male patient greater than 18 year age
        const years = moment().diff(dateOfBirth, 'years');
        if (gender.toLowerCase() == 'male' && years > 18) {
            throw new BadRequestError('Patient age should be less than 18');
        }

        const patientId = req.query.patientId;

        if (patientId !== undefined) {

            const patient = await Patient.findById(patientId);

            if (!patient) {
                throw new BadRequestError("Patient not found!, unable to add new family member");
            }

            if (!mhrId) {
                mhrId = 'NA'
            }
            const partnerInfo = await PartnerInformation.findOne({ ownerOrganisationUID: ownerOrganisationUID });
            let branch = '';
            if (partnerInfo) {
                branch = partnerInfo.legalName + ' ' + partnerInfo.addressLine1 + ' ' + partnerInfo.city + ' ' + partnerInfo.state + ' ' + partnerInfo.country + ' ' + partnerInfo.pincode;
            }
            // Create a Patient  
            const familyMember = Patient.build({
                id: new mongoose.Types.ObjectId().toHexString(),
                patientUID: 'NA',
                ownerOrganisationUID: ownerOrganisationUID,
                userFirstName: userFirstName,
                userMiddleName: '',
                userLastName: '',
                emailId: patient.emailId,
                phoneNumber: patient.phoneNumber,
                phoneNumber2: phoneNumber,
                partnerId: patient.partnerId,
                dateOfBirth: dateOfBirth,
                gender: gender,
                relationship: relationship,
                profileImageName: 'NA',
                parentId: patient.id!,
                motherName: userMotherName,
                upcomingAppointmentDate: 'NA',
                followupConsultationDate: 'NA',
                mhrId: '',
                languages: languages,
                address: address,
                address2: address2,
                area: area,
                city: city,
                state: state,
                country: country,
                pin: pin,
                freeDieticianConsultations: 0,
                freeEducatorConsultations: 0,
                freeDiabetologistConsultations: 0,
                parentName: patient.parentName,
                patientPASID: 'NA',
                nationality: 'NA',
                isVIP: false,
                statusFlag: 'Y',
                branchName: branch
            });
            await familyMember.save();

            //////// Publish New User Create Event
            new FamilyMemberCreatedPublisher(natsWrapper.client).publish({
                id: familyMember.id!,
                userFirstName: familyMember.userFirstName,
                userLastName: familyMember.userLastName,
                emailId: familyMember.emailId,
                phoneNumber: familyMember.phoneNumber,
                partnerId: familyMember.partnerId,
                dateOfBirth: familyMember.dateOfBirth,
                gender: gender,
                parentId: familyMember.parentId,
                languages: familyMember.languages,
                address: familyMember.address,
                city: familyMember.city,
                state: familyMember.state,
                pin: familyMember.pin,
                relationship: familyMember.relationship
            });
            let apiResponse: ApiResponse = {
                status: 200,
                message: 'Success',
                data: familyMember
            }
            res.send(apiResponse);

        }

        const patient = await Patient.findById(req.currentUser!.id);

        if (!patient) {
            throw new BadRequestError("Patient not found!, unable to add new family member");
        }

        if (!mhrId) {
            mhrId = 'NA'
        }
        const partnerInfo = await PartnerInformation.findOne({ ownerOrganisationUID: ownerOrganisationUID });
        let branch = '';
        if (partnerInfo) {
            branch = partnerInfo.legalName + ' ' + partnerInfo.addressLine1 + ' ' + partnerInfo.city + ' ' + partnerInfo.state + ' ' + partnerInfo.country + ' ' + partnerInfo.pincode;
        }
        // Create a Patient  
        const familyMember = Patient.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            patientUID: 'NA',
            ownerOrganisationUID: ownerOrganisationUID,
            userFirstName: userFirstName,
            userMiddleName: userMiddleName,
            userLastName: userLastName,
            emailId: patient.emailId,
            phoneNumber: patient.phoneNumber,
            phoneNumber2: phoneNumber,
            partnerId: patient.partnerId,
            dateOfBirth: dateOfBirth,
            gender: gender,
            relationship: relationship,
            profileImageName: profileImageName ? profileImageName : 'NA',
            parentId: patient.id!,
            motherName: userMotherName,
            upcomingAppointmentDate: 'NA',
            followupConsultationDate: 'NA',
            mhrId: mhrId,
            languages: languages,
            address: address,
            address2: address2,
            area: area,
            city: city,
            state: state,
            country: country,
            pin: pin,
            freeDieticianConsultations: 0,
            freeEducatorConsultations: 0,
            freeDiabetologistConsultations: 0,
            parentName: patient.parentName,
            nationality: 'NA',
            isVIP: false,
            statusFlag: 'A',
            patientPASID: 'NA',
            branchName: branch
        });
        await familyMember.save();

        //////// Publish New User Create Event
        new FamilyMemberCreatedPublisher(natsWrapper.client).publish({
            id: familyMember.id!,
            userFirstName: familyMember.userFirstName,
            userLastName: familyMember.userLastName,
            emailId: familyMember.emailId,
            phoneNumber: familyMember.phoneNumber,
            partnerId: familyMember.partnerId,
            dateOfBirth: familyMember.dateOfBirth,
            gender: gender,
            parentId: familyMember.parentId,
            languages: familyMember.languages,
            address: familyMember.address,
            city: familyMember.city,
            state: familyMember.state,
            pin: familyMember.pin,
            relationship: familyMember.relationship
        });

        let apiResponse: ApiResponse = {
            status: 200,
            message: 'Success',
            data: familyMember
        }
        res.send(apiResponse);
    }
);


export { router as addNewFamilyMemberRouter };
