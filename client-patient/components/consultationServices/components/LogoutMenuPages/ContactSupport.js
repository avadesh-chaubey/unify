import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HeadBreadcrumbs from "../../../common/headBreadcrumbs";
import { styleobj } from "./LogoutMenuPagesStyle";
const useStyles = makeStyles((theme) => styleobj);
export default function ContactSupport() {
  const classes = useStyles();
  return (
    <>
      <HeadBreadcrumbs
        title1={""}
        title2={""}
        title3={"My Profile"}
        mainTitle={"Contact Support"}
      />
      <div style={{ padding: "40px", marginLeft: "15px", display: "flex" }}>
        <Card className={classes.mailCard}>
          <CardContent>
            <IconButton className={classes.mailIconBtn}>
              <img src="/mailicon.png" className={classes.mailIcon} />
              {/* <MailOutlineIcon className={classes.mailIcon} /> */}
            </IconButton>
            <Typography className={classes.mailTypo}>Email</Typography>
            <Divider />
            <Typography className={classes.EmailTypo}>
              Support@rainbow.com
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.phoneCard}>
          <CardContent>
            <IconButton className={classes.phoneIconBtn}>
              <img src="/phoneicon.png" className={classes.phoneIcon} />
              {/* <PhoneOutlinedIcon className={classes.phoneIcon} /> */}
            </IconButton>
            <Typography className={classes.phoneTypo}>Phone</Typography>
            <Divider />
            <Typography className={classes.numberTypo}>99 9999 9999</Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
