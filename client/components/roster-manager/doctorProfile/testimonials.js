import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { makeStyles, useTheme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  testimonials: {
    height: "125px",
    border: "1px solid #e2e2e2",
    padding: "12px",
    margin: "5px",
    background: "#F8F6F6",
    width: "220px",
    fontSize: "14px",
    borderRadius: "3px",
    // color: "#706f6f",
    position: "relative",
  },
  allTestimonials: {
    maxHeight: "max-content",
    border: "1px solid #e2e2e2",
    padding: "12px",
    margin: "5px",
    background: "#F8F6F6",
    // width: "220px",
    fontSize: "14px",
    borderRadius: "3px",
    // color: "#706f6f",
    // position: "relative",
  },
  comment: {
    width: "200px",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
  },
  nameCity: {
    marginTop: "10px",
  },
  addIcon: {
    fontSize: "22px",
    fontWeight: "bold",
    // textAlign:"center",
    color: "#979797",
    marginTop: "35px",
    borderRadius: "3px",
    marginLeft: "56px",
  },
}));
function Testimonials(props) {
  const classes = useStyles();
  const { testimonialList, setTestimonialList } = props;
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [openTestimonial, setOpenTestimonial] = useState(false);
  const [openAllTestimonials, setOpenAllTestimonials] = useState(false);
  const [tempTest, setTempTest] = useState([]);

  useEffect(() => {
    setTempTest(testimonialList);
  }, [testimonialList]);
  const closeTestimonial = () => {
    console.log("closeTestimonial: ");
    setOpenTestimonial(false);
    setComment("");
    setName("");
    setCity("");
  };
  const testimonialSubmit = () => {
    if (name && city && comment) {
      // console.log("TestimonialSubmit");
      console.log("testimonialList :", tempTest);
      let tempArr = [...tempTest];
      let obj = {
        name: name,
        city: city,
        comment: comment,
      };
      console.log("tempArr", tempArr, tempArr.length);
      // console.log("obj: ", obj, " tempArr: ", tempArr);
      tempArr.push(obj);
      setTestimonialList(tempArr);
      closeTestimonial();
    } else {
      props.setMsgData({
        message: "All fields are required",
        type: "error",
      });
    }
  };
  const onTestimonialClick = () => {
    console.log("onTestimonialClick");
    setOpenTestimonial(true);
  };

  const showAllTestimonials = () => {
    setOpenAllTestimonials(true);
  };

  const closeAllTestimonials = () => {
    setOpenAllTestimonials(false);
  };
  return (
    <div>
      <div className="accordianDiv">
        <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
          <AccordionSummary
            expandIcon={
              <img
                src="../arrowUp.svg"
                style={{ width: "20px", height: "10px" }}
              />
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ color: "#343434", fontWeight: 600 }}>
              Testimonials
            </Typography>
            {testimonialList && testimonialList.length > 0 && (
              <div
                style={{
                  right: "50px",
                  position: "absolute",
                  color: "#2188cb",
                  fontWeight: 400,
                }}
                onClick={showAllTestimonials}
              >
                View All
              </div>
            )}
          </AccordionSummary>
          <AccordionDetails style={{ display: "block", minHeight: "50px" }}>
            <div style={{ width: "100%" }}>
              <div className="scrollOuter">
                <div className="scrollInner">
                  {/* {console.log(
                    "testimonialList: ",
                    testimonialList,
                    testimonialList.length
                  )} */}
                  {testimonialList &&
                    testimonialList.length > 0 &&
                    testimonialList.map((item, index) => {
                      if (item != "") {
                        return (
                          <div className={classes.testimonials} key={index}>
                            <div className={classes.comment}>
                              {item.comment}
                            </div>
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
                  <div
                    className={classes.testimonials}
                    style={{ cursor: "pointer", background: "#fff" }}
                    onClick={onTestimonialClick}
                  >
                    <div style={{ width: "200px" }}>
                      <div className={classes.addIcon}>+ Add</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <Dialog
        open={openTestimonial}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Add Testimonial</DialogTitle>
        <DialogContent>
          <div className="fullDiv">
            <TextField
              id="comment"
              // label="Multiline"
              placeholder="Enter your comment ....."
              multiline
              maxRows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div className="fullDiv">
            <TextField
              id="name"
              // label="Multiline"
              placeholder="Enter name ....."
              // multiline
              // maxRows={6}
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div className="fullDiv">
            <TextField
              id="city"
              // label="Multiline"
              placeholder="Enter city ....."
              // multiline
              // maxRows={6}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTestimonial} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={testimonialSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
            testimonialList.map((item, index) => {
              if (item != "") {
                return (
                  <div className={classes.allTestimonials} key={index}>
                    <div>{item.comment}</div>
                    <div className={classes.nameCity}>
                      <span>{item.name}</span>
                      <span style={{ fontWeight: "bold" }}>, {item.city}</span>
                    </div>
                  </div>
                );
              }
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAllTestimonials} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Testimonials;
