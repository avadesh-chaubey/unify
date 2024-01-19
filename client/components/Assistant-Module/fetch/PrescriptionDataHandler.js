import prescriptionData from "./PrescriptionDataList";

const fetchPrescriptionData = (uniqueId) => {
  return prescriptionData.data.find((ele) => {
    return ele.uniqueId == uniqueId;
  });
};
export default fetchPrescriptionData;
