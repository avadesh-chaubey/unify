import { Subjects } from './subjects';

export interface PingServiceSixEvent {
  subject: Subjects.PingServiceSix;
  data: {
    serialNumber: number;
    clientId: string;
  };
}
