export enum AppointmentStatus {
  CaseHistoryPending = 'case:history:pending',
  ReadyForDoctorConsultation = 'ready:for:doctor:consultation',
  SuccessfullyCompleted = 'successfully:completed',
  CompletedWithError = 'completed:with:error',
  Cancelled = 'cancelled',
}