import mongoose from 'mongoose';
import { GenderType, RelationshipType, requireAuth } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface PatientDocumentAttrs {
  id: string;
  title:string;
  category:string;
  date:Date;
  url:string;
  uploadDate:Date;
  patientId:string;
  fileType:string;
}

interface PatientDocumentDoc extends mongoose.Document {
  title:string;
  category:string;
  date:Date;
  url:string;
  uploadDate:Date;
  patientId:string;
  fileType:string;
}


interface PatientDocumentModel extends mongoose.Model<PatientDocumentDoc> {
  build(attrs: PatientDocumentAttrs): PatientDocumentDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PatientDocumentDoc | null>;
}

const patientDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    date: {
      type: Date,
    },
    url: {
      type: String,
    },
    uploadDate: {
      type: Date,
    },
    patientId: {
      type: String,
    },
    fileType: {
      type: String,
      required:false,
      default:""
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
patientDocumentSchema.set('versionKey', 'version');
patientDocumentSchema.plugin(updateIfCurrentPlugin);

patientDocumentSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PatientDocument.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
patientDocumentSchema.static('build', (attrs: PatientDocumentAttrs) => {
  return new PatientDocument({
    _id: attrs.id,
    title: attrs.title,
    category: attrs.category,
    date: attrs.date,
    url: attrs.url,
    uploadDate: attrs.uploadDate,
    patientId: attrs.patientId,
    fileType: attrs.fileType
  });
});

const PatientDocument = mongoose.model<PatientDocumentDoc, PatientDocumentModel>('PatientDocument', patientDocumentSchema);

export { PatientDocument };
