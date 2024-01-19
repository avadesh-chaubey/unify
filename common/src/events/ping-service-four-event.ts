import { Subjects } from './subjects';

export interface PingServiceFourEvent {
  subject: Subjects.PingServiceFour;
  data: {
    serialNumber: number;
    clientId: string;
  };
}
