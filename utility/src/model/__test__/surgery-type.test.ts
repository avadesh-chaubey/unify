import mongoose from "mongoose";
import { SurgeryType } from "../surgery-type";

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a Language
  const id = new mongoose.Types.ObjectId().toHexString();
  const surgeryType = SurgeryType.build({
    id,
    surgeryType: "string",
  });

  // Save the profile to the database
  await surgeryType.save();

  // fetch the Language twice
  const firstInstance = await SurgeryType.findById(surgeryType.id);
  const secondInstance = await SurgeryType.findById(surgeryType.id);

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
  const surgeryType = SurgeryType.build({
    id,
    surgeryType: "string",
  });

  await surgeryType.save();
  expect(surgeryType.version).toEqual(0);
  await surgeryType.save();
  expect(surgeryType.version).toEqual(1);
  await surgeryType.save();
  expect(surgeryType.version).toEqual(2);
});
