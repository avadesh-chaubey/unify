import { Publisher, Subjects, UserCreatedEvent } from '@unifycaredigital/aem';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
