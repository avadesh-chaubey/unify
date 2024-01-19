import React, { useState } from "react";
import {
  Grid,
  makeStyles,
  Card,
  CardActions,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  testimonialsDiv: {
    justifyContent: "flex-end",
    display: "flex",
    fontFamily: "Avenir_heavy !important",
    fontWeight: "bold",
    color: "#502E92",
    cursor: "pointer",
  },
  testimonialsHeading: {
    fontSize: "18px",
    fontWeight: "bold",
    fontFamily: "Avenir_black !important",
    paddingBottom: "15px",
  },
  cardTestimonial: {
    width: "275px",
    backgroundColor: "#F8F6F6",
    boxShadow: "none",
    height: "200px",
  },
  cardTestimonialText: {
    paddingTop: "10px",
    width: "200px",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 6,
    "-webkit-box-orient": "vertical",
  },
  testimonialNameText: {
    fontSize: "12px",
    color: "#555555",
  },
  testimonialCityText: {
    fontSize: "12px",
    color: "#555555",
    fontWeight: "bold",
    fontFamily: "Avenir_heavy !important",
  },
}));

export default function Textimonials(props) {
  const classes = useStyles();
  const [openAllTestimonials, setOpenAllTestimonials] = useState(false);
  const { showProfileData, testimonialList } = props;
  console.log("======>data3", showProfileData);
  const showAllTestimonials = () => {
    setOpenAllTestimonials(true);
  };

  const closeAllTestimonials = () => {
    setOpenAllTestimonials(false);
  };
  return (
    <>
      <Grid contanier justify="space-between" spacing={1}>
        <div class={classes.testimonialsDiv} onClick={showAllTestimonials}>
          View All
        </div>
        <Grid item xs={12}>
          <Typography className={classes.testimonialsHeading}>
            Testimonials
          </Typography>
        </Grid>
        <div style={{ width: "100%" }}>
          <div className="scrollOuter">
            <div className="scrollInner">
              {showProfileData &&
                showProfileData.testimonials &&
                showProfileData.testimonials.map((item) => {
                  return (
                    <Grid
                      item
                      xs={3}
                      style={{ display: "inline-flex", marginRight: "20px" }}
                    >
                      <Card className={classes.cardTestimonial}>
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            className={classes.cardTestimonialText}
                          >
                            {item.comment}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Typography className={classes.testimonialNameText}>
                            {item.name}
                            <span>,</span>
                          </Typography>
                          <Typography className={classes.testimonialCityText}>
                            {item.city}
                          </Typography>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
            </div>
          </div>
        </div>
      </Grid>
      <div>
        <Dialog
          open={openAllTestimonials}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="uploadSec"
        >
          <DialogTitle id="alert-dialog-title">Testimonials</DialogTitle>
          <DialogContent style={{ maxHeight: "400px" }}>
            {testimonialList &&
              testimonialList.length > 0 &&
              testimonialList.map((item) => {
                if (item != "") {
                  return (
                    <div className={classes.allTestimonials}>
                      <div>{item.comment}</div>
                      <div className={classes.nameCity}>
                        <span>{item.name}</span>
                        <span style={{ fontWeight: "bold" }}>
                          , {item.city}
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAllTestimonials} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
