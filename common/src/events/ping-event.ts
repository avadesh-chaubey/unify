import { Subjects } from './subjects';

export interface PingEvent {
  subject: Subjects.Ping;
  data: {
    serialNumber: number;
    clientId: string;
  };
}
