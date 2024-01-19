import { Listener, PartnerInformationCreatedEvent, PartnerInformationUpdatedEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { PartnerInformation } from '../../models/partner-information';
import { partnerInformationUpdatedGroupName } from './queue-group-name';

export class PartnerInformationUpdatedListener extends Listener<PartnerInformationUpdatedEvent> {
  subject: Subjects.PartnerInformationUpdated = Subjects.PartnerInformationUpdated;
  queueGroupName = partnerInformationUpdatedGroupName;

  async onMessage(data: PartnerInformationUpdatedEvent['data'], msg: Message) {
    console.log('PartnerInformationUpdatedEvent Received for id: ', data.id);

    let partnerInformation = await PartnerInformation.findById(data.id);

    if (!partnerInformation) {
      msg.ack();
      return;
    }


    //Update PartnerInformation  
    partnerInformation.set({
      legalName: data.legalName,
      ownerOrganisationUID: data.ownerOrganisationUID,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      status: data.status
    });
    await partnerInformation.save();
    msg.ack();
  }
};
