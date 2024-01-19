import React from "react";
import HeadBreadcrumbs from "../../../common/headBreadcrumbs";
import { makeStyles } from "@material-ui/core";
import NotificationList from "./NotificationList";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    padding: "10px 0",
    position: "relative",
    marginLeft: "60px",
    marginRight: "15px",
  },
}));

export default function NotificationPage() {
  const classes = useStyles();
  return (
    <>
      <HeadBreadcrumbs
        titleArr={["Notification"]}
        mainTitle={"All Notification"}
      />
      <div className={classes.root}>
        <NotificationList />
      </div>
    </>
  );
}
