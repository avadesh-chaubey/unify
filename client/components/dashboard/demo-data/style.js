import {
  darken,
  fade,
  lighten,
} from "@material-ui/core/styles/colorManipulator";

const getBorder = (theme) =>
  `1px solid ${
    theme.palette.type === "light"
      ? lighten(fade(theme.palette.divider, 1), 0.88)
      : darken(fade(theme.palette.divider, 1), 0.68)
  }`;

export const styles = (theme) => ({
  cell: {
    color: "#F5FDFF!important",
    //backgroundColor:'#F5FDFF',
    position: "relative",
    userSelect: "none",
    verticalAlign: "center",
    padding: 0,
    width: "50px",
    height: "90px",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "15px",
    borderLeft: getBorder(theme),
    "&:first-child": {
      borderLeft: "none",
    },
    "&:last-child": {
      paddingRight: 0,
    },
    "tr:last-child &": {
      borderBottom: "none",
    },
    "&:hover": {
      backgroundColor: "white",
    },
    "&:focus": {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
      outline: 0,
    },
  },
  content: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    fontFamily: "Bahnschrift SemiBold",
    color: "#161616",
  },
  text: {
    padding: "0.5em",
    textAlign: "center",
    fontFamily: "Bahnschrift SemiBold",
    color: "#161616",
  },
  // sun: {
  //   color: '#FFEE58',
  // },
  // cloud: {
  //   color: '#90A4AE',
  // },
  // rain: {
  //   color: '#4FC3F7',
  // },
  // sunBack: {
  //   backgroundColor: '#FFFDE7',
  // },
  // cloudBack: {
  //   backgroundColor: '#ECEFF1',
  // },
  // rainBack: {
  //   backgroundColor: '#E1F5FE',
  // },
  opacity: {
    opacity: "0.5",
  },
  appointment: {
    width: "95%",
    height: "50%",
    textAlign: "center",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "12px",
    borderRadius: "20px",
    marginTop: "25px",
    paddingTop: "4px",
    marginLeft: "2px",
    backgroundColor: "#CEEEFF",
    position: "center",
    "&:hover": {
      opacity: 0.6,
      backgroundColor: "#CEEEFF",
    },
  },
  appointment2: {
    width: "20%",
    height: "100%",
    textAlign: "center",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "12px",
    borderRadius: "15px",
    borderTopLeftRadius: "0px",
    borderBottomLeftRadius: "0px",
    //marginTop: "25px",
    paddingTop: "2px",
    marginLeft: "2px",
    backgroundColor: "#CEEEFF",
    "&:hover": {
      opacity: 0.6,
      backgroundColor: "#CEEEFF",
    },
  },
  apptContent: {
    "&>div>div": {
      whiteSpace: "normal !important",
      height: "50px",
      lineHeight: 1.3,
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "11px",
      color: "#040E28",
      //padding:'5px',
      textAlign: "center",
      "&::before": {
        display: "inline-block",
        content: '""',
        borderRadius: "0.375rem",
        height: "0.55rem",
        width: "0.55rem",
        marginRight: "0.3rem",
        backgroundColor: "#452D7B",
      },
    },
  },
  apptContent2: {
    "&>div>div": {
      whiteSpace: "normal !important",
      height: "35px",
      lineHeight: 1.3,
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "11px",
      color: "#040E28",
      //padding:'5px',
      textAlign: "center",
      "&>div": {
        whiteSpace: "normal !important",
        height: "60px",
        lineHeight: 1.3,
        fontFamily: "Bahnschrift SemiBold",
        fontSize: "11px",
        color: "#040E28",
        //padding:'5px',
        textAlign: "center",
      },
      "&::before": {
        display: "inline-block",
        content: '""',
        height: "1.5rem",
        width: "0.20rem",
        marginRight: "0.5rem",
        backgroundColor: "#00ADE7",
        borderRadius: "15px",
        marginTop: "-6px",
        marginLeft: "-8px",
        position: "absolute",
      },
    },
  },

  flexibleSpace: {
    flex: "none",
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
  },
  tooltipContent: {
    padding: theme.spacing(3, 1),
    paddingTop: 0,
    backgroundColor: theme.palette.background.paper,
    boxSizing: "border-box",
    width: "400px",
  },
  tooltipText: {
    ...theme.typography.body2,
    display: "inline-block",
    fontFamily: "Bahnschrift SemiBold",
  },
  title: {
    ...theme.typography.h6,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "Bahnschrift SemiBold",
  },
  icon: {
    color: theme.palette.action.active,
    verticalAlign: "middle",
  },
  circle: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    verticalAlign: "super",
  },
  textCenter: {
    textAlign: "center",
  },
  dateAndTitle: {
    lineHeight: 1.1,
  },
  titleContainer: {
    paddingBottom: theme.spacing(2),
  },
  container: {
    paddingBottom: theme.spacing(1.5),
  },
});
