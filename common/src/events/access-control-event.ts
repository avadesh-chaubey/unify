import { Subjects } from './subjects';

interface accessControl {
	url :  String,
	id  : Number,

}
export interface AccessControlEvent {
  subject: Subjects.AccessControl;
  data: {
	id: String;
	adminAccess: accessControl;
	dashboardOverview : accessControl,
	dashboardFilters: accessControl,
	dashboardDownload: accessControl,
	dashboardPrint: accessControl,
	dashboardPreview: accessControl,
	patientList: accessControl,
	patientListFilters: accessControl,
	patientListDownload: accessControl,
	patientListPrint: accessControl,
	patientListPreview: accessControl,
	doctorList: accessControl,
	doctorListFilters: accessControl,
	doctorListDownload: accessControl,
	doctorListPrint: accessControl,
	doctorListPreview: accessControl,
	appointmentList: accessControl,
	appointmentListFilters: accessControl,
	appointmentListDownload: accessControl,
	appointmentListPrint: accessControl,
	appointmentListPreview: accessControl,
	frontDesk: accessControl,
	roasterManagement: accessControl,
	calender: accessControl,
	roaster: accessControl,
	profile: accessControl,
	fees: accessControl,
	statistics: accessControl,
	employeeOnBoarding: accessControl,
	addNewPatient: accessControl,
	addNewDoctor: accessControl,
	addNewEmployee: accessControl,
	addNewAppointment: accessControl,
	addNewUnit: accessControl,
	addNewArticle: accessControl,
	addNewNotification: accessControl,
	settings: accessControl,
	general: accessControl,
	hospitalInformation: accessControl,
	pharmacy: accessControl,
	branches: accessControl,
	cms: accessControl,
	cmsFilters: accessControl,
	cmsDownload: accessControl,
	cmsPreview: accessControl,
	cmsPrint: accessControl
  };
}
