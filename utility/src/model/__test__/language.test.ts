import mongoose from "mongoose";
import { Language } from "../language";

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a Language
  const id = new mongoose.Types.ObjectId().toHexString();
  const language = Language.build({
    id,
    name: "string",
    shortName: "string",
  });

  // Save the profile to the database
  await language.save();

  // fetch the Language twice
  const firstInstance = await Language.findById(language.id);
  const secondInstance = await Language.findById(language.id);

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
  const language = Language.build({
    id,
    name: "string",
    shortName: "string",
  });

  await language.save();
  expect(language.version).toEqual(0);
  await language.save();
  expect(language.version).toEqual(1);
  await language.save();
  expect(language.version).toEqual(2);
});
