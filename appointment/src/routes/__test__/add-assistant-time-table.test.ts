import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel } from '@unifycaredigital/aem';
import mongoose from 'mongoose';


it('returns an 200 if an timetable applied correctly', async () => {

  const availability = {
    shiftFirstSlotId: 28,
    shiftLastSlotId: 80,
    weeklyDayOff: false
  }
  const availability1 = {
    shiftFirstSlotId: 40,
    shiftLastSlotId: 60,
    weeklyDayOff: false
  }
  const availability2 = {
    shiftFirstSlotId: 30,
    shiftLastSlotId: 75,
    weeklyDayOff: false
  }

  const availabilityOff = {
    shiftFirstSlotId: 30,
    shiftLastSlotId: 75,
    weeklyDayOff: true
  }
  const mondayAvailability = availability;
  const tuesdayAvailability = availability;
  const wednesdayAvailability = availability;
  const thursdayAvailability = availability;
  const fridayAvailability = availabilityOff;
  const saturdayAvailability = availability;
  const sundayAvailability = availability;

  const mondayAvailability1 = availability1;
  const tuesdayAvailability1 = availability1;
  const wednesdayAvailability1 = availability1;
  const thursdayAvailability1 = availability1;
  const fridayAvailability1 = availability1;
  const saturdayAvailability1 = availabilityOff;
  const sundayAvailability1 = availability1;

  const mondayAvailability2 = availability2;
  const tuesdayAvailability2 = availability2;
  const wednesdayAvailability2 = availability2;
  const thursdayAvailability2 = availability2;
  const fridayAvailability2 = availability2;
  const saturdayAvailability2 = availability2;
  const sundayAvailability2 = availabilityOff;

  const rosterManagerId = new mongoose.Types.ObjectId().toHexString();

  const assistantId = new mongoose.Types.ObjectId().toHexString();
  const partnerId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/appointment/assistanttimetable')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      rosterManagerId,
      partnerId))
    .send({
      assistantId: assistantId,
      mondayAvailability,
      tuesdayAvailability,
      wednesdayAvailability,
      thursdayAvailability,
      fridayAvailability,
      saturdayAvailability,
      sundayAvailability
    })
    .expect(200);

  await request(app)
    .post('/api/appointment/assistanttimetable')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      rosterManagerId,
      partnerId))
    .send({
      assistantId: new mongoose.Types.ObjectId().toHexString(),
      mondayAvailability: mondayAvailability1,
      tuesdayAvailability: tuesdayAvailability1,
      wednesdayAvailability: wednesdayAvailability1,
      thursdayAvailability: thursdayAvailability1,
      fridayAvailability: fridayAvailability1,
      saturdayAvailability: saturdayAvailability1,
      sundayAvailability: sundayAvailability1
    })
    .expect(200);

  await request(app)
    .post('/api/appointment/assistanttimetable')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      rosterManagerId,
      partnerId))
    .send({
      assistantId: new mongoose.Types.ObjectId().toHexString(),
      mondayAvailability: mondayAvailability2,
      tuesdayAvailability: tuesdayAvailability2,
      wednesdayAvailability: wednesdayAvailability2,
      thursdayAvailability: thursdayAvailability2,
      fridayAvailability: fridayAvailability2,
      saturdayAvailability: saturdayAvailability2,
      sundayAvailability: sundayAvailability2
    })
    .expect(200);

});

