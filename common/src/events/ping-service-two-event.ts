import { Subjects } from './subjects';

export interface PingServiceTwoEvent {
  subject: Subjects.PingServiceTwo;
  data: {
    serialNumber: number;
    clientId: string;
  };
}
