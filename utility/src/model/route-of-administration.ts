import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface RouteOfAdministrationAttrs {
  id: string;
  routeOfAdministration: string;
}

interface RouteOfAdministrationDoc extends mongoose.Document {
    routeOfAdministration: string;
    version: number;
}


interface RouteOfAdministrationModel extends mongoose.Model<RouteOfAdministrationDoc> {
  build(attrs: RouteOfAdministrationAttrs): RouteOfAdministrationDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<RouteOfAdministrationDoc | null>;
}

const routeOfAdministrationSchema = new mongoose.Schema(
  {
    routeOfAdministration: {
      type: String,
      required: true,
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
routeOfAdministrationSchema.set('versionKey', 'version');
routeOfAdministrationSchema.plugin(updateIfCurrentPlugin);

routeOfAdministrationSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return RouteOfAdministration.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
routeOfAdministrationSchema.static('build', (attrs: RouteOfAdministrationAttrs) => {
  return new RouteOfAdministration({
    _id: attrs.id,
    routeOfAdministration: attrs.routeOfAdministration,
  });
});

const RouteOfAdministration = mongoose.model<RouteOfAdministrationDoc, RouteOfAdministrationModel>('RouteOfAdministration', routeOfAdministrationSchema);

export { RouteOfAdministration };
