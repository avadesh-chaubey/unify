import Queue from 'bull';
import { OrderExpirationPublisher } from '../events/publishers/order-expiration-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  patientId: string;
  productId: string;
}

const orderExpirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});
console.log('orderExpirationQueue')
orderExpirationQueue.process((job, done) => {
  console.log('orderExpirationQueue: product id' + job.data.productId)
  new OrderExpirationPublisher(natsWrapper.client).publish({
    patientId: job.data.patientId,
    productId: job.data.productId,
  });
  done();
});

export { orderExpirationQueue };
