import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface DoctorProfileAttrs {
  id: string;
  uniqueId: string;
  doctorFullName: string;
  profileImageName: string;
  rating: number;
  specializationList: [string];
  experinceInYears: number;
  qualificationList: [string];
  about: string;
  superSpeciality: string;
  experienceList: [string];
  awardAndRecognitionImageUrlList: [{
    description: string,
    imageUrl: string,
    date: Date
  }];
  //awardAndRecognitionsList: [string];
  videoUrlList: [string];
  videoTagList: [string];
  newArticleList: [string];
  linkedInProfileUrl: string;
  facebookProfileUrl: string;
  podcastWorkshopUrl: string;
  podcastWorkshopButtonCaption: string;
  testimonials: [{
    name: string;
    city: string;
    comment: string;
  }];

}

export interface DoctorProfileDoc extends mongoose.Document {
  uniqueId: string;
  doctorFullName: string;
  profileImageName: string;
  rating: number;
  specializationList: [string];
  experinceInYears: number;
  qualificationList: [string];
  about: string;
  superSpeciality: string;
  experienceList: [string];
  awardAndRecognitionImageUrlList: [{
    description: string,
    imageUrl: string,
    date: Date
  }];
  //awardAndRecognitionsList: [string];
  videoUrlList: [string];
  videoTagList: [string];
  newArticleList: [string];
  linkedInProfileUrl: string;
  facebookProfileUrl: string;
  podcastWorkshopUrl: string;
  podcastWorkshopButtonCaption: string;
  version: number;
  testimonials: [{
    name: string;
    city: string;
    comment: string;
  }]
}


interface DoctorProfileModel extends mongoose.Model<DoctorProfileDoc> {
  build(attrs: DoctorProfileAttrs): DoctorProfileDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<DoctorProfileDoc | null>;
}

const doctorProfileSchema = new mongoose.Schema(
  {
    doctorFullName: {
      type: String
    },
    profileImageName: {
      type: String
    },
    rating: {
      type: Number
    },
    specializationList: {
      type: [String]
    },
    experinceInYears: {
      type: Number
    },
    qualificationList: {
      type: [String]
    },
    about: {
      type: String
    },
    superSpeciality: {
      type: String
    },
    experienceList: {
      type: [String]
    },
    awardAndRecognitionImageUrlList: {
      type: [Object]
    },
    // awardAndRecognitionsList: {
    //   type: [String]
    // },
    videoUrlList: {
      type: [String]
    },
    videoTagList: {
      type: [String]
    },
    newArticleList: {
      type: [String]
    },
    linkedInProfileUrl: {
      type: String
    },
    facebookProfileUrl: {
      type: String
    },
    podcastWorkshopUrl: {
      type: String
    },
    podcastWorkshopButtonCaption: {
      type: String
    },
    uniqueId: {
      type: String
    },
    testimonials: {
      type: [Object]
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
doctorProfileSchema.set('versionKey', 'version');
doctorProfileSchema.plugin(updateIfCurrentPlugin);

doctorProfileSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return DoctorProfile.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
doctorProfileSchema.static('build', (attrs: DoctorProfileAttrs) => {
  return new DoctorProfile({
    _id: attrs.id,
    doctorFullName: attrs.doctorFullName,
    uniqueId: attrs.uniqueId,
    profileImageName: attrs.profileImageName,
    rating: attrs.rating,
    specializationList: attrs.specializationList,
    experinceInYears: attrs.experinceInYears,
    qualificationList: attrs.qualificationList,
    about: attrs.about,
    superSpeciality: attrs.superSpeciality,
    experienceList: attrs.experienceList,
    awardAndRecognitionImageUrlList: attrs.awardAndRecognitionImageUrlList,
    //awardAndRecognitionsList: attrs.awardAndRecognitionsList,
    videoUrlList: attrs.videoUrlList,
    videoTagList: attrs.videoTagList,
    newArticleList: attrs.newArticleList,
    linkedInProfileUrl: attrs.linkedInProfileUrl,
    facebookProfileUrl: attrs.facebookProfileUrl,
    podcastWorkshopUrl: attrs.podcastWorkshopUrl,
    podcastWorkshopButtonCaption: attrs.podcastWorkshopButtonCaption,
    testimonials: attrs.testimonials
  });
});

const DoctorProfile = mongoose.model<DoctorProfileDoc, DoctorProfileModel>('DoctorProfile', doctorProfileSchema);

export { DoctorProfile };
