import express, { Request, Response } from 'express';
import { validateRequest, ApiResponse } from '@unifycaredigital/aem';
import { AccessControl } from '../models/access-control';
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';
//import { AccessControlPublisher } from '../events/publishers/access-control-publisher';

const router = express.Router();


router.post(
	'/api/users/accesscontrol',
	[
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { admin,hospitalUnit,hospitalUnitFilters,hospitalUnitEdit,hospitalUnitStatus,access,accessPermission,
			assignRole,manageRoleandPermmission,enableorDisableRole,accessControlResponsibilities,employeeAccessList,
			employeeAccessListFilter,employeeAccessListStatus,employeeOnBoarding,addNewDoctor,addNewEmployee,addNewRole,
			addNewBanner,addNewUnit,addNewArticle,addNewNotification,addsettings,profileManagement,profile,cms,
			cmsFilters,cmsDownload,cmsPrint,cmsPreview,cmsCsv,cmsPdf,cmsSummary,notificationManagement,notificationManagementFilter,
			notificationManagementDownload,notificationManagementPrint,notificationManagementPreview,notificationManagementCsv,
			notificationManagementPdf,notificationManagementSummary,bannerManagement,bannerManagementFilter,bannerManagementtDownload,
			bannerManagementPrint,bannerManagementPreview,bannerManagementCsv,bannerManagementPdf,bannerManagementSummary,
			settings,general,hospitalInformation,pharmacy,branches } = req.body;

		const accessContorl = await AccessControl.build({
			id: new mongoose.Types.ObjectId().toHexString(),
			admin,hospitalUnit,hospitalUnitFilters,hospitalUnitEdit,hospitalUnitStatus,access,accessPermission,
			assignRole,manageRoleandPermmission,enableorDisableRole,accessControlResponsibilities,employeeAccessList,
			employeeAccessListFilter,employeeAccessListStatus,employeeOnBoarding,addNewDoctor,addNewEmployee,addNewRole,
			addNewBanner,addNewUnit,addNewArticle,addNewNotification,addsettings,profileManagement,profile,cms,
			cmsFilters,cmsDownload,cmsPrint,cmsPreview,cmsCsv,cmsPdf,cmsSummary,notificationManagement,notificationManagementFilter,
			notificationManagementDownload,notificationManagementPrint,notificationManagementPreview,notificationManagementCsv,
			notificationManagementPdf,notificationManagementSummary,bannerManagement,bannerManagementFilter,bannerManagementtDownload,
			bannerManagementPrint,bannerManagementPreview,bannerManagementCsv,bannerManagementPdf,bannerManagementSummary,
			settings,general,hospitalInformation,pharmacy,branches
		})
		console.log('accessContorl-->', accessContorl.id);
		await accessContorl.save();

		//new AccessControlPublisher(natsWrapper.client).publish({
		//	id: accessContorl._id,
		//	adminAccess: accessContorl.adminAccess,
		//	dashboardOverview: accessContorl.dashboardOverview,
		//	dashboardFilters: accessContorl.dashboardFilters,
		//	dashboardDownload: accessContorl.dashboardDownload,
		//	dashboardPrint: accessContorl.dashboardPrint,
		//	dashboardPreview: accessContorl.dashboardPreview,
		//	patientList: accessContorl.patientList,
		//	patientListFilters: accessContorl.patientListFilters,
		//	patientListDownload: accessContorl.patientListDownload,
		//	patientListPrint: accessContorl.patientListPrint,
		//	patientListPreview: accessContorl.patientListPreview,
		//	doctorList: accessContorl.doctorList,
		//	doctorListFilters: accessContorl.doctorListFilters,
		//	doctorListDownload: accessContorl.doctorListDownload,
		//	doctorListPrint: accessContorl.doctorListPrint,
		//	doctorListPreview: accessContorl.doctorListPreview,
		//	appointmentList: accessContorl.appointmentList,
		//	appointmentListFilters: accessContorl.appointmentListFilters,
		//	appointmentListDownload: accessContorl.appointmentListDownload,
		//	appointmentListPrint: accessContorl.appointmentListPrint,
		//	appointmentListPreview: accessContorl.appointmentListPreview,
		//	frontDesk: accessContorl.frontDesk,
		//	roasterManagement: accessContorl.roasterManagement,
		//	calender: accessContorl.calender,
		//	roaster: accessContorl.roaster,
		//	profile: accessContorl.profile,
		//	fees: accessContorl.fees,
		//	statistics: accessContorl.statistics,
		//	employeeOnBoarding: accessContorl.employeeOnBoarding,
		//	addNewPatient: accessContorl.addNewPatient,
		//	addNewDoctor: accessContorl.addNewDoctor,
		//	addNewEmployee: accessContorl.addNewEmployee,
		//	addNewAppointment: accessContorl.addNewAppointment,
		//	addNewUnit: accessContorl.addNewUnit,
		//	addNewArticle: accessContorl.addNewArticle,
		//	addNewNotification: accessContorl.addNewNotification,
		//	settings: accessContorl.settings,
		//	general: accessContorl.general,
		//	hospitalInformation: accessContorl.hospitalInformation,
		//	pharmacy: accessContorl.pharmacy,
		//	branches: accessContorl.branches,
		//	cms: accessContorl.cms,
		//	cmsFilters: accessContorl.cmsFilters,
		//	cmsDownload: accessContorl.cmsDownload,
		//	cmsPreview: accessContorl.cmsPreview,
		//	cmsPrint: accessContorl.cmsPrint

		//});


		let apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: accessContorl
		};
		res.send(apiResponse);
	}
);


export { router as accessControlRouter };
