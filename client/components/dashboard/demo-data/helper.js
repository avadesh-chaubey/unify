import { styles } from "./style";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import {
  MonthView,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import TableCell from "@material-ui/core/TableCell";
import classNames from "clsx";
import { isSameMonth } from "date-fns";

export const DayScaleCell = (props) => (
  <MonthView.DayScaleCell
    {...props}
    style={{
      textAlign: "center",
      fontWeight: "bold",
      fontFamily: "Bahnschrift SemiBold",
    }}
  />
);

export const CellBase = React.memo(
  ({ classes, startDate, formatDate, otherMonth }) => {
    const iconId = Math.abs(Math.floor(Math.sin(startDate.getDate()) * 10) % 3);
    const isFirstMonthDay = startDate.getDate() === 1;
    const formatOptions = isFirstMonthDay
      ? { day: "numeric", month: "long" }
      : { day: "numeric" };
    return (
      <TableCell
        tabIndex={0}
        className={classNames({
          [classes.cell]: true,
          [classes.opacity]: otherMonth,
        })}
      >
        <div className={classes.text}>
          {formatDate(startDate, formatOptions)}
        </div>
      </TableCell>
    );
  }
);

export const TimeTableCell = withStyles(styles, { name: "Cell" })(CellBase);

export const Appointment = withStyles(styles, { name: "Appointment" })(
  ({ classes, ...restProps }) => (
    <Appointments.Appointment {...restProps} className={classes.appointment} />
  )
);
export const Appointment2 = withStyles(styles, { name: "Appointment" })(
  ({ classes, ...restProps }) => (
    <Appointments.Appointment {...restProps} className={classes.appointment2} />
  )
);

export const AppointmentContent = withStyles(styles, {
  name: "AppointmentContent",
})(({ classes, ...restProps }) => (
  <Appointments.AppointmentContent
    {...restProps}
    className={classes.apptContent}
  />
));
export const AppointmentContent2 = withStyles(styles, {
  name: "AppointmentContent",
})(({ classes, ...restProps }) => (
  <Appointments.AppointmentContent
    {...restProps}
    className={classes.apptContent2}
  />
));

export const ExternalViewSwitcher = ({ currentViewName, onClick, classes }) => (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        position: "absolute",
        width: "790px",
        alignItems: "center",
        height: "64px",
      }}
    >
      <div style={{ zIndex: 1 }}>
        <p className={classes.divText}>Thursday, 16 </p>
      </div>
      <div style={{ zIndex: 1 }}>
        {" "}
        <Button
          onClick={() => onClick("Day")}
          value="Day"
          className={
            currentViewName === "Day"
              ? classes.calanderButtonActive
              : classes.calanderButton
          }
        >
          Day
        </Button>
        <Button
          onClick={() => onClick("Month")}
          value="Month"
          className={
            currentViewName === "Month"
              ? classes.calanderButtonActive
              : classes.calanderButton
          }
        >
          Month
        </Button>
      </div>
    </div>
  </>
);
