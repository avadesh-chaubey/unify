import { Subjects } from './subjects';

export interface PingServiceThreeEvent {
  subject: Subjects.PingServiceThree;
  data: {
    serialNumber: number;
    clientId: string;
  };
}
