import React from 'react';
import config from '../../app.constant';
import Lightbox from "react-awesome-lightbox";
import { Avatar, Link, Tooltip } from '@material-ui/core';

export default function SupportCenterDetails (props) {
  const {
    patientSelected,
    showImage,
    openRescheduleDig,
    openCancelAndRefund,
    setShowImage
  } = props;

  return (
    <div>
      <div className="detailHeader">
        <div
          className="detailHeadleft"
          style={{ textTransform: "capitalize", display: 'inline-flex' }}
        >
          {!!showImage && (
            <Lightbox
              onClose={() => setShowImage(!showImage)}
              title={patientSelected.customerName}
              image={
                patientSelected.customerProfileImageName === 'NA'
                  ? `/user.svg`
                  : `${config.API_URL}/api/utility/download/${
                      patientSelected.customerProfileImageName
                    }`
                }
            />
          ) }

          <Link href="#" onClick={e => {
              e.preventDefault();
              setShowImage(!showImage);
            }}
          >
            <Avatar
              className="customer-profile-pic"
              src={patientSelected.customerProfileImageName === 'NA'
                ? '/user.svg'
                : `${config.API_URL}/api/utility/download/${patientSelected.customerProfileImageName}`}
              alt="Alt Balaji"
            />
          </Link>
          { patientSelected.customerName }
        </div>
        <div className="detailHeadRight">
          <span
            className="bookNew book-appointment"
            onClick={() => openNewApmt(daySelected)}
          >
            BOOK NEW APPOINTEMENT
          </span>
          {/* onClick={signOutBtn} */}
          <img
            src="phoneCall.svg"
            className="callBtn"
            style={{ cursor: "not-allowed", display: 'none' }}
          />
          <img
            src="videoCall.svg"
            className="callBtn"
            style={{ cursor: "not-allowed", display: 'none' }}
          />
          <img
            src="../doctor/chat.svg"
            className="callBtn"
            style={{ cursor: "not-allowed", height: 25 }}
          />
          {/* <span>audio</span> */}
          {/* <span>video</span> */}
        </div>
      </div>
      <div className="patientDetails patient-details-main">
        <div className="detailItem">
          <span className="title1">Patient</span>
          <span
            className="title2"
            style={{ textTransform: "capitalize" }}
          >
            {patientSelected.customerName
              ? patientSelected.customerName
              : " "}
          </span>
          <span className="title1" style={{ marginLeft: "15px" }}>
            (Self)
          </span>
        </div>
        <div className="detailItem">
          <div className="title1">Doctor</div>
          <div
            className="title2 main-details"
            style={{ textTransform: "capitalize", display: 'inline-flex' }}
          >
            <div className="docDetails">
              <Tooltip
                title={`${patientSelected.consultantName}`}
                placement="top"
                arrow
              >
                <div className="customer-support-docName doc-name-2">
                  { patientSelected.consultantName }
                </div>
              </Tooltip>
            </div>
          </div>
          <div
            className="title1"
            style={{
              marginLeft: "15px",
              textTransform: "capitalize",
            }}
          >
            (
            {patientSelected.consultantDesignation
              ? patientSelected.consultantDesignation
              : " "}
            )
          </div>
        </div>
        <div className="detailItem">
          <span className="title1">Date</span>
          <span className="title2">
            {patientSelected.showAppointmentDate
              ? patientSelected.showAppointmentDate
              : "-"}
          </span>
          <span
            style={{ color: "#0068e1" }}
            className="clickableItem"
            onClick={openRescheduleDig}
          >
            RESCHEDULE
          </span>
        </div>
        <div className="detailItem">
          <span className="title1">Time</span>
          <span className="title2">
            {patientSelected.appointmentSlot}
          </span>
        </div>
        <div
          className="detailItem"
          style={{ borderBottom: "none" }}
        >
          <span className="title1">Fee</span>
          <span className="title2">
            ₹ &nbsp;
            {patientSelected.basePriceInINR
              ? patientSelected.basePriceInINR
              : "450"}
          </span>
          <span
            style={{ color: "#a81c07" }}
            className="clickableItem"
            onClick={openCancelAndRefund}
          >
            CANCEL & REFUND
          </span>
        </div>
      </div>
    </div>
  );
}