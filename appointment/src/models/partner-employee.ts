import mongoose from 'mongoose';
import { UserStatus, UserType, AccessLevel, DepartmentType, SpecializationType, GenderType, LocationBasedFeeConfig } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PartnerEmployeeAttrs {
	id: string;
	userFirstName: string;
	userLastName: string;
	emailId: string;
	phoneNumber: string;
	password: string;
	userType: UserType;
	partnerId: string;
	accessLevel: AccessLevel;
	lastAuthAt: Date;
	userStatus: UserStatus;
	registrationTimeAndDate: Date;
	pin: string;
	employeeId: string;
	specialization: SpecializationType;
	qualificationList: [string];
	experinceInYears: number;
	organization: string;
    profileImageName: string;
	city: string;
	nextAvailableSlot: string;
    organizationUID: string,
    specialityUID: string
}

export interface PartnerEmployeeDoc extends mongoose.Document {
	userFirstName: string;
	userLastName: string;
	emailId: string;
	phoneNumber: string;
	password: string;
	userType: UserType;
	partnerId: string;
	accessLevel: AccessLevel;
	lastAuthAt: Date;
	userStatus: UserStatus;
	registrationTimeAndDate: Date;
	pin: string;
	employeeId: string;
	specialization: SpecializationType;
	qualificationList: [string];
	experinceInYears: number;
	organization: string;
	profileImageName: string;
	city: string;
	nextAvailableSlot: string;
	organizationUID: string,
    specialityUID: string
}


interface PartnerEmployeeModel extends mongoose.Model<PartnerEmployeeDoc> {
	build(attrs: PartnerEmployeeAttrs): PartnerEmployeeDoc;
	findByEvent(event: {
		id: string;
		version: number;
	}): Promise<PartnerEmployeeDoc | null>;
}

const partnerEmployeeSchema = new mongoose.Schema(
	{
		emailId: {
			type: String,
			required: true
		},
		phoneNumber: {
			type: String,
			required: true
		},
		password: {
			type: String,
		},
		userType: {
			type: UserType,
			required: true
		},
		partnerId: {
			type: String,
			required: true
		},
		accessLevel: {
			type: AccessLevel,
			required: true
		},
		lastAuthAt: {
			type: Date,
			required: true
		},
		registrationTimeAndDate: {
			type: Date,
			required: true
		},
		userStatus: {
			type: UserStatus,
			required: true
		},
		userFirstName: {
			type: String,
			required: true
		},
		userLastName: {
			type: String,
			required: false,
			default: ""
		},
		pin: {
			type: String,
			required: false,
			default: ""
		},
		employeeId: {
			type: String,
			required: false,
			default: ""
		},
		specialization: {
			type: SpecializationType,
			required: false,
		},
		qualificationList: {
			type: [String],
			required: false,
		},
		experinceInYears: {
			type: Number,
			required: true,
		},
		organization: {
			type: String,
			required: false,
		},
		profileImageName: {
			type: String,
			required: false,
		},
		city: {
			type: String,
			required: false,
		},
		nextAvailableSlot: {
			type: String,
			required: false,
		},
		organizationUID: {
			type: String,
			required: false,
		},
		specialityUID: {
			type: String,
			required: false,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);
partnerEmployeeSchema.set('versionKey', 'version');
partnerEmployeeSchema.plugin(updateIfCurrentPlugin);

partnerEmployeeSchema.static('findByEvent', (event: { id: string, version: number }) => {
	return PartnerEmployee.findOne({
		_id: event.id,
		version: event.version - 1,
	});
});
partnerEmployeeSchema.static('build', (attrs: PartnerEmployeeAttrs) => {
	return new PartnerEmployee({
		_id: attrs.id,
		userFirstName: attrs.userFirstName,
		userLastName: attrs.userLastName,
		emailId: attrs.emailId,
		phoneNumber: attrs.phoneNumber,
		password: attrs.password,
		userType: attrs.userType,
		partnerId: attrs.partnerId,
		accessLevel: attrs.accessLevel,
		lastAuthAt: attrs.lastAuthAt,
		userStatus: attrs.userStatus,
		registrationTimeAndDate: attrs.registrationTimeAndDate,
		pin: attrs.pin,
		employeeId: attrs.employeeId,
		specialization: attrs.specialization,
		qualificationList: attrs.qualificationList,
		experinceInYears: attrs.experinceInYears,
		organization: attrs.organization,
		nextAvailableSlot: attrs.nextAvailableSlot,
		profileImageName: attrs.profileImageName,
		city: attrs.city,
		organizationUID: attrs.organizationUID,
		specialityUID: attrs.specialityUID
	});
});

const PartnerEmployee = mongoose.model<PartnerEmployeeDoc, PartnerEmployeeModel>('PartnerEmployee', partnerEmployeeSchema);

export { PartnerEmployee };
