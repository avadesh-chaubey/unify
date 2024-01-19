import request from 'supertest';
import { app } from '../../app';

it('Return 200 OK when valid Parameters passed', async () => {
  await request(app)
    .post('/api/users/sendphoneemailotp')
    .send({
      phoneNumber: '6666666666',
      emailId: 'test@test.com',
    })
    .expect(200);
});
