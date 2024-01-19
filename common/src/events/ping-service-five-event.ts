import { Subjects } from './subjects';

export interface PingServiceFiveEvent {
  subject: Subjects.PingServiceFive;
  data: {
    serialNumber: number;
    clientId: string;
  };
}
