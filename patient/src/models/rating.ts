import mongoose from 'mongoose';
import { GenderType, RelationshipType, requireAuth } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface ratingAttrs {
  id: string;
  rating:number;
  comment:string;
  userId:string;
  appointmentId:string;
  revisit :Boolean;
  eventCompletionCheck :Boolean;
  reviewAt :Date;
}

interface rating extends mongoose.Document {
    // id: string;
    rating:number;
    comment:string;
    userId:string;
    appointmentId:string;
    revisit :Boolean;
    eventCompletionCheck :Boolean;
    reviewAt :Date;
}


interface ratingModel extends mongoose.Model<rating> {
  build(attrs: ratingAttrs): rating;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<rating | null>;
}

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required:true
    },
    comment: {
      type: String,
    },
    userId: {
      type: String,
    },
    appointmentId: {
      type: String,
    },
    revisit: {
      type: Boolean,
    },
    eventCompletionCheck: {
      type: Boolean,
    },
    reviewAt: {
      type: Date,
    },

    
  },
//   {
//     toJSON: {
//       transform(doc, ret) {
//         ret.id = ret._id;
//         delete ret._id;
//       },
//     },
//   }
);
ratingSchema.set('versionKey', 'version');
ratingSchema.plugin(updateIfCurrentPlugin);

ratingSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return ratingTable.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
ratingSchema.static('build', (attrs: ratingAttrs) => {
  return new ratingTable({
    _id: attrs.id,
    rating: attrs.rating,
    comment: attrs.comment,
    userId: attrs.userId,
    appointmentId: attrs.appointmentId,
    revisit: attrs.revisit,
    eventCompletionCheck: attrs.eventCompletionCheck,
    reviewAt: attrs.reviewAt
  });
});

const ratingTable = mongoose.model<rating, ratingModel>('rating', ratingSchema);

export { ratingTable };
