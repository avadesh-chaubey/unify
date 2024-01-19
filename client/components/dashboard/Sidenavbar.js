import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import SimpleBar from "simplebar-react";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: "3em !important",
    background: "#823588",
    background: "-webkit-linear-gradient(to top, #823588, #c1264bba)",
    background: "linear-gradient(to bottom, #823588, #c1264bba)",
    marginLeft: "-35px",
    marginRight: "0px",
    "& > div ": {
      border: "0px",
    },
  },
  itemActiveUrl: {
    backgroundColor: "rgba(255, 255,255, 0.4)",
    backgroundColor: "#452D7B",
  },
  itemActive: {
    padding: "10px 0px 0px 30px !important",
    color: "#fff",
  },
  treeItme: {
    border: "1px solid #fff !important",
    borderWidth: "0 0 0px 1px !important",
    paddingLeft: "12px !important",
    paddingTop: "15px",
    "&:hover": {
      backgroundColor: "rgba(3, 3, 3, 0.5)",
    },
    "&::before": {
      position: "absolute",
      top: "0",
      left: "0em",
      display: "block",
      height: "30px",
      width: "1em",
      borderBottom: "1px solid #fff",
      content: '""',
    },
  },
  treeItmeLast: {
    border: "1px solid #fff !important",
    borderWidth: "0 0 0px 0px !important",
    paddingLeft: "12px !important",
    paddingTop: "15px",
    "&:hover": {
      backgroundColor: "rgba(3, 3, 3, 0.5)",
    },
    "&::before": {
      position: "absolute",
      top: "0",
      left: "0em",
      display: "block",
      height: "30px",
      borderLeft: "1px solid #fff",
      width: "1em",
      borderBottom: "1px solid #fff",
      content: '""',
    },
  },
  icon: {
    width: "30px",
    height: "30px",
  },
  text: {
    "& > span": {
      color: "#fff !important",
      paddingLeft: "0px !important",
      paddingTop: "0px",
      marginTop: "0px !important",
      fontFamily: "Bahnschrift SemiBold",
      fontWeight: "100",
    },
  },
  mainText: {
    flex: "1 1 auto",
    minWidth: "0",
    marginTop: "4px",
    marginBottom: "-8px",
    "& > span": {
      color: "#fff !important",
      paddingLeft: "60px !important",
      paddingTop: "0px",
      marginTop: "-29px !important",
      fontFamily: "Bahnschrift SemiBold",
      fontWeight: "100",
    },
  },
}));
const style = {
  display: "flex",
  flexDirection: "column",
  position: "relative",
  left: "0px",
  width: "100%",
  height: "100%",
  background: "linear-gradient(20deg, #C1264B 30%, #823588 90%)",
};
export default function Sidenavbar() {
  const router = useRouter();
  const classes = useStyles();
  const urlPath = router.pathname;
  const [urlBaseName, setUrlBaseName] = useState("");
  const [showSuperAdminNav, setShowSuperAdminNav] = useState(false);
  const [expendableOpen, setExpendableOpen] = useState(
    urlPath === "/admin/dashboard" ? false : true
  );
  const [onboardingPage, setOnboardingPage] = useState("");

  useEffect(() => {
    if (
      urlPath === "/adminAccessPermission" ||
      urlPath === "/employeeAccessList" ||
      urlPath === "/manageRolesPermisson"
    ) {
      setShowSuperAdminNav(true);
    }
    // Get the base name of url
    setUrlBaseName(router.pathname.split("/")[1]);

    switch (urlPath) {
      case "/onboarding/addEmployee":
        setOnboardingPage("ADD EMPLOYEE");
        break;
      case "/onboarding/addAppointment":
        setOnboardingPage("ADD APPOINTMENT");
        break;
      case "/onboarding/addRole":
        setOnboardingPage("ADD ROLE");
        break;

      default:
        setOnboardingPage("ADD EMPLOYEE");
    }
  }, []);

  const handleExpendable = () => {
    setExpendableOpen(!expendableOpen);
  };
  const appointmentHandler = () => {
    router.push("/admin/appointmentsList");
  };
  const patientdHandler = () => {
    router.push("/admin/patientList");
  };
  const doctordHandler = () => {
    router.push("/admin/doctorList");
  };
  const laborderHandler = () => {
    router.push("/admin/laborderList");
  };
  const pharmacyHandler = () => {
    router.push("/admin/pharmacyorderList");
  };
  const dashboardHandler = () => {
    router.push("/admin/dashboard");
  };
  const employeeOnboarding = () => (
    <div
      className={`items ${
        urlPath === "/employee/employeeOnboarding"
          ? `active ${classes.itemActive}`
          : ""
      }
      `}
    >
      <Link href="/employee/employeeOnboarding">
        <img
          src="/emp_onboarding.svg"
          className="logo"
          style={{ padding: "5px" }}
        />
        <span>ONBOARDING</span>
      </Link>
    </div>
  );
  return (
    <div className="left-area">
      <div className="unifyLogo">
        <Link href="/portals">
          <img src="/logo/unifycare_admin_logo.png" className="logo" />
        </Link>
        <span>
          <img
            src="/diahome-txt.svg"
            style={{ width: "212px", marginLeft: "13px", display: "none" }}
          />
        </span>
      </div>
      <SimpleBar className="side-navbar-scroll">
        {/* Admin Section */}
        {showSuperAdminNav === false && urlBaseName === "admin" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/admin/dashboard"
                  ? `active ${classes.itemActive}`
                  : ""
              } `}
            >
              {/* <img src="employees.svg" className="logo" /> */}
              <img src="/DashboardIcon.svg" className={classes.icon} />
              {expendableOpen ? (
                <ExpandMore style={{ color: "#fff" }} />
              ) : (
                <ExpandLess style={{ color: "#fff" }} />
              )}
              {/* <span style={{fontFamily:'Bahnschrift SemiBold', fontSize:'15px', marginTop:'15px', verticalAlign:'top'}} >DASHBOARD</span> */}
              <ListItemText
                primary="DASHBOARD"
                className={classes.mainText}
                onClick={handleExpendable}
              />
              <Collapse
                in={expendableOpen}
                timeout="auto"
                unmountOnExit
                className={classes.root}
              >
                <List
                  component="div"
                  disablePadding
                  className={
                    urlPath == "/admin/dashboard" ? classes.itemActiveUrl : ""
                  }
                >
                  <ListItem
                    button
                    className={classes.treeItme}
                    onClick={dashboardHandler}
                  >
                    <ListItemIcon>
                      <img src="/Overview icon.svg" className={classes.icon} />
                    </ListItemIcon>
                    <ListItemText primary="OVERVIEW" className={classes.text} />
                  </ListItem>
                </List>
                <List
                  component="div"
                  disablePadding
                  className={
                    urlPath == "/admin/patientList" ? classes.itemActiveUrl : ""
                  }
                >
                  <ListItem
                    button
                    className={classes.treeItme}
                    onClick={patientdHandler}
                  >
                    <ListItemIcon>
                      <img
                        src="/Patient list icon.svg"
                        className={classes.icon}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="PATIENT LIST"
                      className={classes.text}
                    />
                  </ListItem>
                </List>
                <List
                  component="div"
                  disablePadding
                  className={
                    urlPath == "/admin/doctorList" ? classes.itemActiveUrl : ""
                  }
                >
                  <ListItem
                    button
                    className={classes.treeItme}
                    onClick={doctordHandler}
                  >
                    <ListItemIcon>
                      <img
                        src="/Doctor list icon.svg"
                        className={classes.icon}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="DOCTOR LIST"
                      className={classes.text}
                    />
                  </ListItem>
                </List>
                <List
                  component="div"
                  disablePadding
                  className={
                    urlPath == "/admin/appointmentsList"
                      ? classes.itemActiveUrl
                      : ""
                  }
                >
                  <ListItem
                    button
                    className={classes.treeItme}
                    onClick={appointmentHandler}
                  >
                    <ListItemIcon>
                      <img
                        src="/Appointment list icon.svg"
                        className={classes.icon}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="APPOINTMENT LIST"
                      className={classes.text}
                    />
                  </ListItem>
                </List>
                <List
                  component="div"
                  disablePadding
                  className={
                    urlPath == "/admin/laborderList"
                      ? classes.itemActiveUrl
                      : ""
                  }
                >
                  <ListItem
                    button
                    className={classes.treeItme}
                    onClick={laborderHandler}
                  >
                    <ListItemIcon>
                      <img
                        src="/Lab orders list icon.svg"
                        className={classes.icon}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="LAB ORDER LIST"
                      className={classes.text}
                    />
                  </ListItem>
                </List>
                <List
                  component="div"
                  disablePadding
                  className={
                    urlPath == "/admin/pharmacyorderList"
                      ? classes.itemActiveUrl
                      : ""
                  }
                >
                  <ListItem
                    button
                    className={classes.treeItmeLast}
                    onClick={pharmacyHandler}
                  >
                    <ListItemIcon>
                      <img
                        src="/Pharmacy orders.svg"
                        className={classes.icon}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="PHARMACY ORDERS"
                      className={classes.text}
                    />
                  </ListItem>
                </List>
              </Collapse>
            </div>
            {/* <div
              className="items"
              onClick={toSupportCenter}
            >
              <img
                src="support.svg"
                className="logo"
                style={{ padding: "5px" }}
              />
              <span>SUPPORT CENTER</span>
            </div> */}
            {/* <div style={{ display: 'none' }} className={`items ${
              urlPath === "/reports"
                ? `active ${classes.itemActive}`
                : ''}
            `}>
            <Link href="/reports">
              <img
                src="report.svg"
                className="logo"
                style={{ padding: "5px" }}
              />
              <span>UPLOAD REPORTS</span>
            </Link>
          </div> */}
            {/* <div className={`items ${
              urlPath === "/notificationManagement"
                ? `active ${classes.itemActive}`
                : ''}
            `}
          >
            <Link href="/notificationManagementList">
              <img
                src="/bell.svg"
                className="logo bell"
                style={{ padding: "5px" }}
              />
              <span>NOTIFICATION MGMT</span>
            </Link>
          </div> */}
            <div
              className={`items ${
                urlPath === "/admin/hospitalUnit"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/admin/hospitalUnit">
                <img
                  src="/logo/hospital_unit_icon.svg"
                  className="logo"
                  style={{ padding: "5px" }}
                />
                <span>HOSPITAL UNITS</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {/* Front Desk Section */}
        {urlBaseName === "frontDesk" && (
          <div className="menu-items">
            <div
              style={{ display: "none" }}
              className={`items ${
                urlPath === "/frontDesk/listing"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/frontDesk/listing">
                <img src="/employees.svg" className="logo" />
                <span>ALL EMPLOYEES</span>
              </Link>
            </div>
            <div
              className={`items ${
                urlPath === "/frontDesk/roasterManagement"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/frontDesk/roasterManagement">
                <img
                  src="/roaster.svg"
                  className="logo"
                  style={{ padding: "5px" }}
                />
                <span>ROASTER MANAGEMENT</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {/* Pharmacy Section */}
        {urlBaseName === "pharmacy" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/pharmacy/allMedicines"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/pharmacy/allMedicines">
                <img
                  src="/medicine.svg"
                  className="logo"
                  style={{ padding: "5px" }}
                />
                <span>MEDICINE ONBOARD</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {/* Diagnostic Section */}
        {urlBaseName === "diagnostic" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/diagnostic/tests"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/diagnostic/tests">
                <img
                  src="/tests.svg"
                  className="logo"
                  style={{ padding: "5px" }}
                />
                <span>DIAGNOSTIC TEST</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {/* CMS Section */}
        {urlBaseName === "cms" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/cms/contentManagementList" ||
                urlPath === "/cms/blogPost"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/cms/contentManagementList">
                <img
                  src="/content_mgmt_icon.svg"
                  className="logo bell"
                  style={{ padding: "5px" }}
                />
                <span>CONTENT MGMT</span>
              </Link>
            </div>

            <div
              className={`items ${
                urlPath === "/cms/notificationManagementList" ||
                urlPath === "/cms/addNewNotification"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/cms/notificationManagementList">
                <img
                  src="/notification_bell_icon.svg"
                  className="logo bell"
                  style={{ padding: "5px" }}
                />
                <span>NOTIFICATION MGMT</span>
              </Link>
            </div>

            <div
              className={`items ${
                urlPath === "/cms/bannerManagementList" ||
                urlPath === "/cms/addNewBanner"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/cms/bannerManagementList">
                <img
                  src="/banner_icon.svg"
                  className="logo bell"
                  style={{ padding: "5px" }}
                />
                <span>BANNER MGMT</span>
              </Link>
            </div>

            {employeeOnboarding()}
          </div>
        )}
        {/* Settings Section */}
        {urlBaseName === "setting" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/setting" ? `active ${classes.itemActive}` : ""
              }
            `}
            >
              <Link href="/setting">
                <img
                  src="/portal/settings.svg"
                  className="logo bell"
                  style={{ padding: "5px" }}
                />
                <span>SETTINGS</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {urlBaseName === "addnewappointment" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/addnewappointment"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/addnewappointment">
                <img
                  src="/portal/addAppointment.svg"
                  className="logo bell"
                  style={{ padding: "5px" }}
                />
                <span>ADD APPOINTMENT</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {urlBaseName === "addnewpharmacyorder" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/addnewpharmacyorder"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/addnewpharmacyorder">
                <img
                  src="/portal/addNewPharmacy.svg"
                  className="logo bell"
                  style={{ padding: "5px" }}
                />
                <span>ADD PHARMACY ORDER</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {/* Settings Section */}
        {urlBaseName === "supportCenter" && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/setting" ? `active ${classes.itemActive}` : ""
              }
            `}
            >
              <Link href="/supportCenter/customerSupportHomePage">
                <img
                  src="/portal/support_section.svg"
                  className="logo bell"
                  style={{ padding: "5px" }}
                />
                <span>SUPPORT CENTER</span>
              </Link>
            </div>
            {employeeOnboarding()}
          </div>
        )}
        {/* Access Section */}
        {showSuperAdminNav === true && (
          <div className="menu-items">
            <div
              className={`items ${
                urlPath === "/adminAccessPermission"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href="/adminAccessPermission">
                <img src="/accessIcon3.svg" className="logo bell" />
                <span>ACCESS PERMISSION</span>
              </Link>
            </div>
            <div
              className={`items ${
                urlPath === "/manageRolesPermisson"
                  ? `active ${classes.itemActive}`
                  : ""
              }
          `}
            >
              <Link href="/manageRolesPermisson">
                <img src="/accessIcon1.svg" className="logo bell" />
                <span>MANAGE ROLE AND PERMISSION</span>
              </Link>
            </div>
            <div
              className={`items ${
                urlPath === "/employeeAccessList"
                  ? `active ${classes.itemActive}`
                  : ""
              }
          `}
            >
              <Link href="/employeeAccessList">
                <img src="/accessIcon2.svg" className="logo bell" />
                <span>EMPLOYEE ACCESS LIST</span>
              </Link>
            </div>
          </div>
        )}

        {/* Onboarding Section */}
        {urlBaseName === "onboarding" && (
          <div className="menu-items">
            <div
              style={{
                display:
                  urlPath === "/onboarding/addRole" ||
                  urlPath === "/onboarding/addEmployee" ||
                  urlPath === "/onboarding/addAppointment"
                    ? ""
                    : "none",
              }}
              className={`items ${
                urlPath === "/onboarding/addRole" ||
                urlPath === "/onboarding/addEmployee" ||
                urlPath === "/onboarding/addAppointment"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href={urlPath}>
                <img src="/add_new_icon.svg" className="logo" />
                <span>{onboardingPage}</span>
              </Link>
            </div>

            <div
              style={{
                display: urlPath === "/onboarding/addDoctor" ? "" : "none",
              }}
              className={`items ${
                urlPath === "/onboarding/addDoctor"
                  ? `active ${classes.itemActive}`
                  : ""
              }
            `}
            >
              <Link href={urlPath}>
                <img src="/add_doctor_icon.svg" className="logo" />
                <span>ADD DOCTOR</span>
              </Link>
            </div>

            {employeeOnboarding()}
          </div>
        )}
      </SimpleBar>
    </div>
  );
}
