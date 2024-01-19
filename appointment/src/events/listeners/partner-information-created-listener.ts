import { Listener, PartnerInformationCreatedEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { PartnerInformation } from '../../models/partner-information';
import { partnerInformationCreatedGroupName } from './queue-group-name';

export class PartnerInformationCreatedListener extends Listener<PartnerInformationCreatedEvent> {
  subject: Subjects.PartnerInformationCreated = Subjects.PartnerInformationCreated;
  queueGroupName = partnerInformationCreatedGroupName;

  async onMessage(data: PartnerInformationCreatedEvent['data'], msg: Message) {
    console.log('PartnerInformationCreatedEvent Received for id: ', data.id);

    let partnerInformation = await PartnerInformation.findById(data.id);

    if (partnerInformation) {
      msg.ack();
      return;
    }


    // Create a PartnerInformation  
    partnerInformation = PartnerInformation.build({
      id: data.id,
      partnerId: data.partnerId,
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
