import { Subjects } from './subjects';

export interface PingServiceOneEvent {
  subject: Subjects.PingServiceOne;
  data: {
    serialNumber: number;
    clientId: string;
  };
}
