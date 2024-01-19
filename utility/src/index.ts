import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { DatabaseBackupListener } from './events/listeners/database-backup-listener';
import { DatabaseUploadListener } from './events/listeners/database-upload-listener';
import { LabType } from '@unifycaredigital/aem';
import { PingListener } from './events/listeners/ping-listener';
import { Liveness } from './model/liveness';
//import { DrugType, LabType } from '@unifycaredigital/aem';
const fs = require("fs");
const fastcsv = require("fast-csv");
const mongodb = require("mongodb").MongoClient;

var restore = require('@cdxoo/mongodb-restore');

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.DATABACKUP_TAR_FILENAME) {
    throw new Error('DATABACKUP_TAR_FILENAME must be defined');
  }
  if (!process.env.SYSTEM_SENDER_EMAIL_ID) {
    throw new Error('SYSTEM_SENDER_EMAIL_ID must be defined');
  }
  if (!process.env.SYSTEM_SENDER_FULL_NAME) {
    throw new Error('SYSTEM_SENDER_FULL_NAME must be defined');
  }
  if (!process.env.SYSTEM_SMS_SENDER_ID) {
    throw new Error('SYSTEM_SMS_SENDER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new DatabaseBackupListener(natsWrapper.client).listen();
    new DatabaseUploadListener(natsWrapper.client).listen();
    new PingListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');

    let liveness = await Liveness.findOne({});
    if (!liveness) {
      liveness = Liveness.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        currentSerialNumber: 0,
        oldSerialNumber: 0,
        pingCount: 0
      });
      await liveness.save()
    }

    //Restoring Static DB
    await restore.database({
      uri: process.env.MONGO_URI,
      database: 'utility',
      from: './staticdb/'
    });
    console.log('Static API data Restored');


    // This is NOT a Dead code..don't remove it 
    // Use to update mongodb with CSV files in dev environmemt

    // let stream = fs.createReadStream("./csvfiles/medicineList.csv");

    // let csvData: {
    //   medicineType: string;
    //   medicineName: string;
    //   packOf: string;
    //   MRP: number;
    //   gstInPercentage: number;
    //   hsnCode: string;
    // }[] = [];
    // let csvStream = fastcsv
    //   .parse()
    //   .on("data", function (data: any[]) {
    //     csvData.push({
    //       medicineType: data[0],
    //       medicineName: data[1],
    //       packOf: data[2],
    //       MRP: data[3],
    //       gstInPercentage: data[4],
    //       hsnCode: data[5],
    //     });
    //   })
    //   .on("end", async function () {

    //     await mongodb.connect(
    //       process.env.MONGO_URI,
    //       { useNewUrlParser: true, useUnifiedTopology: true },
    //       (err: any, client: { db: (arg0: string) => { (): any; new(): any; collection: { (arg0: string): { (): any; new(): any; insertMany: { (arg0: any, arg1: (err: any, res: any) => void): void; new(): any; }; }; new(): any; }; }; close: () => void; }) => {
    //         if (err) throw err;
    //         client
    //           .db("utility")
    //           .collection("medicines")
    //           .insertMany(csvData, (err: any, res: { insertedCount: any; }) => {
    //             if (err) throw err;
    //             console.log(`Inserted: ${res.insertedCount} rows`);
    //             client.close();
    //           });
    //       }
    //     );
    //   });

    // stream.pipe(csvStream);

  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
};

start();
