function createData(SNo, drugType, drugName, dose, comment) {
  return { SNo, drugType, drugName, dose, comment };
}
const prescriptionData = {
  data: [
    {
      uniqueId: "UT1090",
      visit: "Last visited",
      visitDate: "09-03-2018",
      bp: "100/80 mm Hg",
      pulse: "92 bpm",
      height: "185cm",
      weight: "90 kg",
      temperature: "90 F",
      bmi: "35.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 1 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "1-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "1-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "20/06/2021",
      referals: "Dr. Rajeev Sharma",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN",
          "TRESIBA PENFILL (Degludec)",
          "0 - 0- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 0- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 5MG TAB (Glipizide)",
          "GLYNASE XL 5MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 25MG TAB (Acarbose)",
          "0 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
    {
      uniqueId: "UT1091",
      visit: "Last visited",
      visitDate: "09-03-2020",
      bp: "125/80 mm Hg",
      pulse: "72 bpm",
      height: "170cm",
      weight: "50 kg",
      temperature: "100 F",
      bmi: "32.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "2-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "2-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "10/11/2021",
      referals: "Dr. Rajeev Yadav",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN",
          "TRESIBA PENFILL (Degludec)",
          "0 - 0- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 0- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 5MG TAB (Glipizide)",
          "GLYNASE XL 5MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 25MG TAB (Acarbose)",
          "0 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
    {
      uniqueId: "UT1092",
      visit: "Last visited",
      visitDate: "29-05-2017",
      bp: "120/80 mm Hg",
      pulse: "62 bpm",
      height: "150cm",
      weight: "60 kg",
      temperature: "101 F",
      bmi: "30.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "3-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "3-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "10/10/2019",
      referals: "Dr. Mukesh Sharma",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN",
          "TRESIBA PENFILL (Degludec)",
          "0 - 0- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 0- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 5MG TAB (Glipizide)",
          "GLYNASE XL 5MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 25MG TAB (Acarbose)",
          "0 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
    {
      uniqueId: "UT1093",
      visit: "Last visited",
      visitDate: "15-10-2020",
      bp: "120/80 mm Hg",
      pulse: "82 bpm",
      height: "180cm",
      weight: "100 kg",
      temperature: "102 F",
      bmi: "30.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "4-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "4-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "15/06/2021",
      referals: "Dr. Varun Sharma",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN",
          "TRESIBA PENFILL (Degludec)",
          "0 - 0- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 0- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 5MG TAB (Glipizide)",
          "GLYNASE XL 5MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 25MG TAB (Acarbose)",
          "0 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
    {
      uniqueId: "UT1094",
      visit: "Last visited",
      visitDate: "19-11-2017",
      bp: "120/80 mm Hg",
      pulse: "82 bpm",
      height: "180cm",
      weight: "100 kg",
      temperature: "103 F",
      bmi: "30.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "5-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "5-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "12/12/2017",
      referals: "Dr. Test Sharma",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN",
          "TRESIBA PENFILL (Degludec)",
          "0 - 0- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 0- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 5MG TAB (Glipizide)",
          "GLYNASE XL 5MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 25MG TAB (Acarbose)",
          "0 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
    {
      uniqueId: "UT1095",
      visit: "Last visited",
      visitDate: "31-03-2017",
      bp: "120/80 mm Hg",
      pulse: "82 bpm",
      height: "180cm",
      weight: "100 kg",
      temperature: "99 F",
      bmi: "30.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "6-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "6-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "10/12/2021",
      referals: "Doc Test",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN",
          "TRESIBA PENFILL (Degludec)",
          "0 - 0- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 0- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 5MG TAB (Glipizide)",
          "GLYNASE XL 5MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 25MG TAB (Acarbose)",
          "0 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
    {
      uniqueId: "UT1096",
      visit: "Last visited",
      visitDate: "17-12-2022",
      bp: "120/80 mm Hg",
      pulse: "82 bpm",
      height: "180cm",
      weight: "100 kg",
      temperature: "99 F",
      bmi: "30.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "7-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "7-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "10/06/2022",
      referals: "Dr. Rajeev Sharma",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN",
          "TRESIBA PENFILL (Degludec)",
          "0 - 0- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 0- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 5MG TAB (Glipizide)",
          "GLYNASE XL 5MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 25MG TAB (Acarbose)",
          "0 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
    {
      uniqueId: "UT1097",
      visit: "Last visited",
      visitDate: "23-12-2022",
      bp: "110/82 mm Hg",
      pulse: "82 bpm",
      height: "180cm",
      weight: "100 kg",
      temperature: "99 F",
      bmi: "30.86 Kg/m",
      complaints: "GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA",
      diagnosis: "TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA",
      advice:
        "8-Restrict Sugar, Low salt intake, reduce oil usage while cooking",
      medicalHistory: "Hypertension, Anxiety",
      surgicalHistory: "Eye Surgery",
      dietAllergies: "Peanuts",
      drugAllergies: "Steroids",
      personalHistory: "NA",
      lifestyle: "Working",
      habits: "Drinking, Smoking occasionally",
      familyHistory: "Hypertension",
      pregnancyDetails: "NA",
      testsPrescribed: "7-HBA1C, LIPID PROFILE, CREATINNE",
      prescribedOn: "10/06/2021",
      referals: "Dr. Thapa ",
      tableList: [
        createData(1, "ADVICE", "DIET AND EXERCISE", "0 - 0 - 0", ""),
        createData(
          2,
          "INSULIN 5",
          "TRESIBA PENFILL (Degludec)",
          "0 - 5- 14 [At Bed Time]",
          ""
        ),
        createData(
          3,
          "INSULIN 3",
          "NOVORAPID PENFILL (Catridge)",
          "0 - 8- 10 [15 min Before Food]",
          ""
        ),
        createData(
          4,
          "TABLET",
          "GLYNASE XL 50MG TAB (Glipizide)",
          "GLYNASE XL 50MG TAB (Glipizide)",
          ""
        ),
        createData(
          5,
          "TABLET",
          "GLUCOBAY 250MG TAB (Acarbose)",
          "10 - 0- 1 [With Food]",
          ""
        ),
      ],
    },
  ],
};
export default prescriptionData;
