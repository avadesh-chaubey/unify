import { DrugType } from "@unifycaredigital/aem";
import mongoose from "mongoose";
import { Medicine } from "../medicine";

it("implements optimistic concurrency control", async (done) => {
  // Create an instance of a MedicineType
  const id = new mongoose.Types.ObjectId().toHexString();
  const medicineType = Medicine.build({
    id,
    medicineType: DrugType.Balm,
    medicineName: 'string',
    packOf: 'string',
    MRP: 300,
    gstInPercentage: 5,
    hsnCode: '123123'
  });

  // Save the profile to the database
  await medicineType.save();

  // fetch the MedicineType twice
  const firstInstance = await Medicine.findById(medicineType.id);
  const secondInstance = await Medicine.findById(medicineType.id);

  // save the first fetched MedicineType
  await firstInstance!.save();

  // save the second fetched MedicineType and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not reach this point");
});


