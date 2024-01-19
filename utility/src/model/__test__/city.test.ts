import mongoose from "mongoose";
import { City } from "../city";

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a city
  const id = new mongoose.Types.ObjectId().toHexString();
  const city = City.build({
    id,
    name: "string",
    cityCode: "string",
    countryName: "string",
    stateName: "string",
    stateCode: "string",
    countryCode: "string",
  });

  // Save the profile to the database
  await city.save();

  // fetch the city twice
  const firstInstance = await City.findById(city.id);
  const secondInstance = await City.findById(city.id);

  // save the first fetched city
  await firstInstance!.save();

  // save the second fetched city and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const city = City.build({
    id,
    name: "string",
    cityCode: "string",
    countryName: "string",
    stateName: "string",
    stateCode: "string",
    countryCode: "string",
  });

  await city.save();
  expect(city.version).toEqual(0);
  await city.save();
  expect(city.version).toEqual(1);
  await city.save();
  expect(city.version).toEqual(2);
});
