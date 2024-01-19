export const owners = [
  {
    text: "Mrs. Shikha Sharma",
    id: 1,
    color: "#7467F0",
  },
  {
    text: "Mr. Vivek Kumar",
    id: 2,
    color: "#7467F0",
  },
  {
    text: "Mr. Yashvant Pant",
    id: 3,
    color: "#7467F0",
  },
  {
    text: "Mrs. Varsha Singh",
    id: 4,
    color: "#7467F0",
  },
  {
    text: "Mrs. Lipika Sharma",
    id: 5,
    color: "#ff99b8",
  },
  {
    text: "Arthur Miller",
    id: 6,
    color: "#7467F0",
  },
];

export const resources = [
  {
    fieldName: "ownerId",
    title: "Owners",
    instances: owners,
  },
];

export const appointments = [
  {
    id: 1,
    title: "4 Appot",
    startDate: new Date("2021-07-22 9:30:00"),
    endDate: new Date("2021-07-22 10:30:00"),
    ownerId: 1,
  },
  {
    id: 2,
    title: "1 Appt ",
    startDate: new Date(2021, 6, 7, 12, 0),
    endDate: new Date(2021, 6, 7, 13, 0),
    ownerId: 4,
  },
  {
    id: 3,
    title: "1 Appt",
    startDate: new Date(2021, 7, 15, 14, 30),
    endDate: new Date(2021, 8, 15, 15, 30),
    ownerId: 4,
  },
  {
    id: 1,
    title: "6 Appt",
    startDate: new Date(2021, 6, 20, 12, 0),
    endDate: new Date(2021, 6, 20, 13, 35),
    ownerId: 4,
  },
  {
    id: 1,
    title: "4 Appoitment",
    startDate: new Date(2021, 6, 24, 12, 0),
    endDate: new Date(2021, 6, 24, 13, 35),
    ownerId: 4,
  },
  {
    id: 1,
    title: "On Leave",
    startDate: new Date(2021, 6, 27, 12, 0),
    endDate: new Date(2021, 6, 27, 13, 35),
    ownerId: 5,
  },
];
