import React from "react";
import { Link } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from '@material-ui/core/styles';
import time from "../../data/time.json";

function PastConsultations({ appointment, openPast, select }) {

  const getDate = (date) => {
    // const input = "yyyy-mm-dd"
    const [year, month, day] = date.split("-");
    // result = dd-mm-yyyy
    const inputDate = `${day}-${month}-${year}`;
    return inputDate;
  };

  const getSlot = (slot) => {
    const getTime = time.filter((t) => t.value === slot);
    return getTime[0].label;
  };

  const useStyles = makeStyles((theme) => ({
    activeCard: {
      borderRadius: '4px',
      border: 'solid 2px #2188cb',
      backgroundColor: '#e1efff',
    },
    pastListHover: {
      '&:hover': {
        cursor: 'pointer',
        border: 'solid 2px #e1efff',
        backgroundColor: '#e1efff',
      }
    }

  }));
  const classes = useStyles();
  const link = 'http://210.18.155.76:8080/btecMC2Atma/pages/login.jsf';

  return (
    <>
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: "#00888a", fontWeight: 600 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#00888a", fontWeight: 600 }}>
            All Consultations (
              {
                <Link
                  rel="noreferrer"
                  href={link}
                  target="_blank"
                  variant="body2"
                  underline="none"
                >
                  Link to ATMA
                </Link>
              }
            )
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          {appointment.length > 0 ? (
            <div className="cs-patientDocs">
              {appointment.map((p, index) => (
                <div className="cs-patient-doc-detail">
                  <div
                    className={`cs-doc-past
                    ${classes.pastListHover}
                    ${(index === select) ? classes.activeCard : ''}`}

                    key={index}
                    onClick={() =>
                      openPast(
                        p.id,
                        // p.appointmentDate,
                        p.consultantId,
                        p.assistantId,
                        index,
                        getSlot(p.appointmentSlotId),
                        getDate(p.appointmentDate),
                      )
                    }
                  >
                    <p>
                      <strong>&nbsp;{p.consultantName}</strong>
                    </p>
                    <p>{getDate(p.appointmentDate)}</p>
                    <p>{getSlot(p.appointmentSlotId)} {p.currentAppointment=== true ?"(Current)":""}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
              <div style={{ color: "grey" }}>
                No Past Consultation data Avaliable
              </div>
            )}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default PastConsultations;
