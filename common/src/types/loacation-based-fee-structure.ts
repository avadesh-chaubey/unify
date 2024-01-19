export interface LocationBasedFeeConfig {
  country: string;
  state: string;
  city: string;
  locationConfig: string;
  flatFees: number;
  feeInPercentage: number;
  followUpFees: number;
  appointmentType: string;
}
