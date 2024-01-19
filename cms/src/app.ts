import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerGetDocument } from './swagger-get';
import { swaggerPostDocument } from './swagger-post';
import { swaggerDeleteDocument } from './swagger-delete';
import { swaggerPutDocument } from './swagger-put';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';
import { getBlogByTitle } from './routes/find-blog-by-title';
import { Liveness } from './models/liveness';
import { PingPublisher } from './events/publishers/ping-publisher';
import { natsWrapper } from './nats-wrapper';
import { addTagRouter } from './routes/add-tag';
import { addCategoryRouter } from './routes/add-category';
import { allTagRouter } from './routes/find-all-tags';
import { allCategoryRouter } from './routes/find-all-categories';
import { addBlogRouter } from './routes/add-blog';
import { deleteBlogRouter } from './routes/delete-blog';
import { getAllBlog } from './routes/find-all-blog-list';
import { getBlogByBlogId } from './routes/find-blog-by-blogId';
import { updateCategoryRouter } from './routes/update-category';
import { updateTagRouter } from './routes/update-tag';
import { deleteTagRouter } from './routes/remove-tag';
import { deleteCategoryRouter } from './routes/remove-category';
import { getBlogByAuthorName } from './routes/find-blog-by-author-name';
import { updateCmsBlogStatusRouter } from './routes/update-blog-status';

const MAX_MISSED_PING_COUNT = 1;


const probe = require('kube-probe');

var cors = require('cors')

const app = express();

app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:3001', 'https://patientpro.unify.care'] }));

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

probe(app, {
  bypassProtection: true,
  livenessCallback: async (request: any, response: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; }) => {
    let liveness = await Liveness.findOne({});
    if (liveness) {
      liveness.set({
        currentSerialNumber: liveness.currentSerialNumber + 1,
        oldSerialNumber: liveness.oldSerialNumber,
        pingCount: liveness.pingCount + 1
      });
      await liveness.save();
      new PingPublisher(natsWrapper.client).publish({
        serialNumber: liveness.currentSerialNumber,
        clientId: String(process.env.NATS_CLIENT_ID)
      });
      if (liveness.pingCount > MAX_MISSED_PING_COUNT) {
        console.log(`${String(process.env.NATS_CLIENT_ID)} : Not OK`);
        return response.status(404).send('Not OK')
      }
    }
    return response.status(200).send('OK');
  }
});

app.use(currentUser);

app.use(loggerMiddleware);
app.use(winstonMiddleware);
app.use(getBlogByTitle);
app.use('/api/cms/unify/swagger/post', swaggerUi.serveFiles(swaggerPostDocument), swaggerUi.setup(swaggerPostDocument));
app.use('/api/cms/unify/swagger/get', swaggerUi.serveFiles(swaggerGetDocument), swaggerUi.setup(swaggerGetDocument));
app.use('/api/cms/unify/swagger/delete', swaggerUi.serveFiles(swaggerDeleteDocument), swaggerUi.setup(swaggerDeleteDocument));
app.use('/api/cms/unify/swagger/put', swaggerUi.serveFiles(swaggerPutDocument), swaggerUi.setup(swaggerPutDocument));
app.use(addTagRouter);
app.use(addCategoryRouter);
app.use(allTagRouter);
app.use(allCategoryRouter);
app.use(addBlogRouter);
app.use(deleteBlogRouter);
app.use(getAllBlog);
app.use(getBlogByBlogId);
app.use(updateCategoryRouter);
app.use(updateTagRouter);
app.use(deleteTagRouter);
app.use(deleteCategoryRouter);
app.use(getBlogByAuthorName);
app.use(getBlogByTitle);
app.use(updateCmsBlogStatusRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
