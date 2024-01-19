import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { LabType } from '@unifycaredigital/aem'


interface DiagnosticTestAttrs {
  id: string;
  serviceType: string;
  cost: number;
  preCondition: string;
  reportWaitingTime: string;
  addCollectionCharges: boolean;
  lab: LabType;
}

export interface DiagnosticTestDoc extends mongoose.Document {
  serviceType: string;
  cost: number;
  addCollectionCharges: boolean;
  preCondition: string;
  reportWaitingTime: string;
  lab: LabType;
}


interface DiagnosticTestModel extends mongoose.Model<DiagnosticTestDoc> {
  build(attrs: DiagnosticTestAttrs): DiagnosticTestDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<DiagnosticTestDoc | null>;
}

const diagnosticTestSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: true,
    },
    addCollectionCharges: {
      type: Boolean,
      required: false,
    },
    cost: {
      type: Number,
      required: true,
    },
    preCondition: {
      type: String,
      required: false,
    },
    reportWaitingTime: {
      type: String,
      required: false,
    },
    lab: {
      type: LabType,
      required: false,
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
diagnosticTestSchema.set('versionKey', 'version');
diagnosticTestSchema.plugin(updateIfCurrentPlugin);

diagnosticTestSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return DiagnosticTest.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
diagnosticTestSchema.static('build', (attrs: DiagnosticTestAttrs) => {
  return new DiagnosticTest({
    _id: attrs.id,
    addCollectionCharges: attrs.addCollectionCharges,
    serviceType: attrs.serviceType,
    cost: attrs.cost,
    preCondition: attrs.preCondition,
    reportWaitingTime: attrs.reportWaitingTime,
    lab: attrs.lab
  });
});

const DiagnosticTest = mongoose.model<DiagnosticTestDoc, DiagnosticTestModel>('DiagnosticTest', diagnosticTestSchema);

export { DiagnosticTest };
