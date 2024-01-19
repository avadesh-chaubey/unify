import mongoose from "mongoose";
import { ChiefComplaint } from "../chief-complaint";

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a Language
  const id = new mongoose.Types.ObjectId().toHexString();
  const chiefComplaint = ChiefComplaint.build({
    id,
    chiefComplaint: "string",
  });

  // Save the profile to the database
  await chiefComplaint.save();

  // fetch the Language twice
  const firstInstance = await ChiefComplaint.findById(chiefComplaint.id);
  const secondInstance = await ChiefComplaint.findById(chiefComplaint.id);

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
  const chiefComplaint = ChiefComplaint.build({
    id,
    chiefComplaint: "string",
  });

  await chiefComplaint.save();
  expect(chiefComplaint.version).toEqual(0);
  await chiefComplaint.save();
  expect(chiefComplaint.version).toEqual(1);
  await chiefComplaint.save();
  expect(chiefComplaint.version).toEqual(2);
});
