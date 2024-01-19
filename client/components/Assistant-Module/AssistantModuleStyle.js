export const assistantModuleStyle = {
  //AssistantDoctor
  mainViewCard: {
    width: "80%",
    height: "90px",
    overflowX: "hidden",
    float: "left",
    padding: "0px",
    marginTop: "20px",
    paddingRight: "5px",
    borderRadius: "4px",
    border: "1px solid #BBBABA",

    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#e1efff",
    },
  },
  mainViewCardActive: {
    borderRadius: "4px",
    border: "solid 2px #2188cb",
    backgroundColor: "#e1efff",
    width: "80%",
    height: "90px",
    overflowX: "hidden",
    float: "left",
    padding: "0px",
    marginTop: "20px",
    paddingRight: "5px",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#e1efff",
    },
  },
  cardContantDiv: {
    padding: "28px 2px !important",
    // backgroundColor: "blue",
    display: "flex",
    float: "left",
    textAlign: "left",
    padding: "20px 0px",
    width: "70%",
    position: "relative",
    bottom: "30px",
  },
  doctorSpecialization: {
    position: "absolute",
    fontSize: "11px",
    bottom: "5px",
    color: "#817E7E",
  },
  timeIconDiv: {
    position: "absolute",
    fontSize: "11px",
    bottom: "5px",
    color: "#817E7E",
    // transform: "translate(200px, 0)",
    display: "flex",
    alignItems: "center",
  },
  timeIcon: {
    width: "15px",
    color: "#565454",
    marginRight: "5px",
  },
  dateIconDiv: {
    position: "absolute",
    fontSize: "11px",
    bottom: "5px",
    color: "#817E7E",
    transform: "translate(200px, 0)",
    display: "flex",
    alignItems: "center",
  },
  dateIcon: {
    width: "15px",
    color: "#565454",
    marginRight: "5px",
  },
};
