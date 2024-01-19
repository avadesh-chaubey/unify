export enum PartnerStates {
  AddPartnerInformation = 'add-partner-information',
  AddPartnerSigningAuth = 'add-partner-signing-auth',
  AddPartnerBankingDetails = 'add-partner-banking-details',
  UpdatePartnerInformation = 'update-partner-information',
  UpdatePartnerSigningAuth = 'update-partner-signing-auth',
  UpdatePartnerBankingDetails = 'update-partner-banking-details',
  PartnerVerificationPending = 'partner-verification-pending',
  PartnerVerifiedAndActive = 'partner-verified-and-active',
  PartnerVerificationRejected = 'partner-verification-rejected',
  PartnerAccountSuspended = 'partner-account-suspended',
}
