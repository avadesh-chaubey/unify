import { UserType, FileType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TestReportAttrs {
  id: string,
  patientId: string,
  isDiahomeTestReport: boolean;
  appointmentId: string;
  appointmentDate: string;
  appointmentSlotId: number;
  testName: string;
  testReportFileName: string,
  testReportDate: Date;
  testReportUploadDate: Date;
  testReportStorageFileName: string;
  fileType: FileType;
  testReportUploaderId: string;
}

interface TestReportDoc extends mongoose.Document {
  patientId: string,
  isDiahomeTestReport: boolean;
  appointmentId: string;
  appointmentDate: string;
  appointmentSlotId: number;
  testName: string;
  testReportFileName: string,
  testReportDate: Date;
  testReportUploadDate: Date;
  testReportStorageFileName: string;
  fileType: FileType;
  testReportUploaderId: string;
  version: number;
}

interface TestReportModel extends mongoose.Model<TestReportDoc> {
  build(attrs: TestReportAttrs): TestReportDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TestReportDoc | null>;
}

const testReportSchema = new mongoose.Schema(
  {
    fileType: {
      type: FileType,
      required: true
    },
    patientId: {
      type: String,
      required: true
    },
    isDiahomeTestReport: {
      type: Boolean,
      required: true
    },
    appointmentId: {
      type: String,
    },
    appointmentDate: {
      type: String,
    },
    appointmentSlotId: {
      type: Number,
    },
    testName: {
      type: String,
      required: true
    },
    testReportFileName: {
      type: String,
      required: true
    },
    testReportDate: {
      type: Date,
    },
    testReportUploadDate: {
      type: Date,
    },
    testReportStorageFileName: {
      type: String,
      required: true
    },
    testReportUploaderId: {
      type: String,
      required: true
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
testReportSchema.set('versionKey', 'version');
testReportSchema.plugin(updateIfCurrentPlugin);

testReportSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return TestReport.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

testReportSchema.static('build', (attrs: TestReportAttrs) => {
  return new TestReport({
    _id: attrs.id,
    patientId: attrs.patientId,
    isDiahomeTestReport: attrs.isDiahomeTestReport,
    appointmentId: attrs.appointmentId,
    appointmentDate: attrs.appointmentDate,
    appointmentSlotId: attrs.appointmentSlotId,
    testName: attrs.testName,
    testReportFileName: attrs.testReportFileName,
    testReportDate: attrs.testReportDate,
    testReportUploadDate: attrs.testReportUploadDate,
    testReportStorageFileName: attrs.testReportStorageFileName,
    fileType: attrs.fileType,
    testReportUploaderId: attrs.testReportUploaderId,
  });
});


const TestReport = mongoose.model<TestReportDoc, TestReportModel>('TestReport', testReportSchema);

export { TestReport };
