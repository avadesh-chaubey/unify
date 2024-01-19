import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { AppointmentStatus, ConsultationType, requireAuth, UserStatus, UserType, validateRequest} from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import { Appointment } from '../models/appointment';
const router = express.Router();

router.post(
  '/api/partner/doctorswithlocation',
  requireAuth,
  [
    body('city').not().isEmpty().withMessage('City is required'),
    body('state').not().isEmpty().withMessage('State is required'),
    body('country').not().isEmpty().withMessage('Country is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      city, state, country, userType, viewAll, patientID
    } = req.body;

    //const partnerID = req.currentUser!.fid;
    const newList = [];
    let appointment;
    if(viewAll===false){
      console.log('viewAll:', viewAll);
      console.log('userType:', userType);
      let custId = req.currentUser!.id;
      if(patientID !== null){
        custId = patientID;
        console.log('custId:', patientID);
      }
      appointment = await Appointment.findOne({
        customerId: custId,
        consultationType: userType}
      )
    }
    console.log('appointment:', appointment);
    let consultantId = '';
    if (appointment) {
      consultantId = appointment.consultantId;
      console.log('consultantId:', consultantId);
      const doctor = await PartnerEmployee.findOne({ _id: consultantId});
      console.log('doctor:', doctor);
      newList.push(doctor);
    } else {
      if (req.currentUser!.uty === UserType.Patient) {
        if (userType) {
          let uType = userType as UserType;
          const doctors = await PartnerEmployee.find({ userType: uType });
          
          for (let i = 0; i < doctors.length; i++) {
            if (doctors[i].userStatus === UserStatus.Verified
              || doctors[i].userStatus === UserStatus.Active) {
                  newList.push(doctors[i]);
            }
          }
          
        }
      }
    }

    const apiResponse = {
      status: 200,
      message: 'Success',
      data: newList
    };
    res.send(apiResponse);
});

export { router as showAllDoctorsWithLocationRouter };
