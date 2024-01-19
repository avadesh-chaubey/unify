import { UserType, FileType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface FileStorageAttrs {
  id: string,
  userId: string,
  userType: string;
  partnerId: string;
  fileType: FileType;
  fileName: string;
}

interface FileStorageDoc extends mongoose.Document {
  userId: string,
  userType: string;
  partnerId: string;
  fileType: FileType;
  fileName: string;
  version: number;
}

interface FileStorageModel extends mongoose.Model<FileStorageDoc> {
  build(attrs: FileStorageAttrs): FileStorageDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<FileStorageDoc | null>;
}

const fileStorageSchema = new mongoose.Schema(
  {
    fileType: {
      type: FileType,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    partnerId: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      required: true
    }
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
fileStorageSchema.set('versionKey', 'version');
fileStorageSchema.plugin(updateIfCurrentPlugin);

fileStorageSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return FileStorage.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

fileStorageSchema.static('build', (attrs: FileStorageAttrs) => {
  return new FileStorage({
    _id: attrs.id,
    userId: attrs.userId,
    userType: attrs.userType,
    partnerId: attrs.partnerId,
    fileType: attrs.fileType,
    fileName: attrs.fileName,
  });
});


const FileStorage = mongoose.model<FileStorageDoc, FileStorageModel>('FileStorage', fileStorageSchema);

export { FileStorage };
