import request from 'supertest';
import { app } from '../../app';

it('Return 200 OK when valid Parameters passed', async () => {
  await request(app)
    .post('/api/users/sendphoneotp')
    .send({
      phoneNumber: '6666666666',
    })
    .expect(200);
});
