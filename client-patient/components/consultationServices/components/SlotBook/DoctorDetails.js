import React from "react";
import { Typography, CardContent, Card, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import router from "next/router";
import { doctorStyle } from "./DoctorDetailStyle";

const useStyles = makeStyles((theme) => doctorStyle);

export default function DoctorDetails(props) {
  const classes = useStyles();
  const { doctorId } = props;
  console.log("======>doctorIdDoctorDetails", doctorId, props);
  const onViewProfile = () => {
    router.push("/doctorProfile?id=" + doctorId);
  };
  console.log("");
  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.mainDiv}>
            <img src="/PritiChopra.png" className={classes.doctorImgDiv} />
            <div className={classes.doctorDetailDiv}>
              <Typography className={classes.doctorNameTypo}>
                Dr. Priti Chopra
              </Typography>
              <Typography className={classes.qualificationTypo}>
                Pediatrician &nbsp; MD, MBBS, 12 yrs
              </Typography>
              <Typography className={classes.addressTypo}>
                <img src="/location_logo.svg" className={classes.locationImg} />
                Madhukar Rainbow Children Hospital & Birth Right, Delhi
              </Typography>
            </div>
            <div className={classes.bookSlottext}>Rs. 500</div>
            <br />
            <div className={classes.bookSlottextsec}>Consultation Fee</div>
            <Button className={classes.profileButton} onClick={onViewProfile}>
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
