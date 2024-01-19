import mongoose from "mongoose";
import { DiagnosticTest } from "../diagnostic-test";
import { LabType } from '@unifycaredigital/aem'

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a DiagnosticTest
  const id = new mongoose.Types.ObjectId().toHexString();
  const testType = DiagnosticTest.build({
    id,
    serviceType: "string",
    cost: 100,
    preCondition: "string",
    reportWaitingTime: "string",
    lab: LabType.ARH,
    addCollectionCharges: false
  });

  // Save the profile to the database
  await testType.save();

  // fetch the DiagnosticTest twice
  const firstInstance = await DiagnosticTest.findById(testType.id);
  const secondInstance = await DiagnosticTest.findById(testType.id);

  // save the first fetched DiagnosticTest
  await firstInstance!.save();

  // save the second fetched DiagnosticTest and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not reach this point");
});

