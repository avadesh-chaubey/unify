import mongoose from "mongoose";
import { RouteOfAdministration } from "../route-of-administration";

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a Language
  const id = new mongoose.Types.ObjectId().toHexString();
  const routeOfAdministration = RouteOfAdministration.build({
    id,
    routeOfAdministration: "string",
  });

  // Save the profile to the database
  await routeOfAdministration.save();

  // fetch the Language twice
  const firstInstance = await RouteOfAdministration.findById(routeOfAdministration.id);
  const secondInstance = await RouteOfAdministration.findById(routeOfAdministration.id);

  // save the first fetched Language
  await firstInstance!.save();

  // save the second fetched Language and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const routeOfAdministration = RouteOfAdministration.build({
    id,
    routeOfAdministration: "string",
  });

  await routeOfAdministration.save();
  expect(routeOfAdministration.version).toEqual(0);
  await routeOfAdministration.save();
  expect(routeOfAdministration.version).toEqual(1);
  await routeOfAdministration.save();
  expect(routeOfAdministration.version).toEqual(2);
});
