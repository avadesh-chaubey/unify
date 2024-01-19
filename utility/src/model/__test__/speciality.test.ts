import mongoose from "mongoose";
import { SpecialityType } from "../speciality-type";

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a Language
  const id = new mongoose.Types.ObjectId().toHexString();
  const speciality = SpecialityType.build({
    id,
    specialityType: "string",
  });

  // Save the profile to the database
  await speciality.save();

  // fetch the Language twice
  const firstInstance = await SpecialityType.findById(speciality.id);
  const secondInstance = await SpecialityType.findById(speciality.id);

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
  const speciality = SpecialityType.build({
    id,
    specialityType: "string",
  });

  await speciality.save();
  expect(speciality.version).toEqual(0);
  await speciality.save();
  expect(speciality.version).toEqual(1);
  await speciality.save();
  expect(speciality.version).toEqual(2);
});
