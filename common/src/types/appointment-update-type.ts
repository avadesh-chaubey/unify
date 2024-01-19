export enum AppointmentUpdateType {
  CaseHistoryPending = 'case:history:pending',
  ReadyForDoctorConsultation = 'ready:for:doctor:consultation',
  MarkForReschedule = 'mark:for:reschedule',
  RescheduleExpired = 'reschedule:expired',
  AssistantTimeUpdate = 'assistant:time:update',
  SuccessfullyCompleted = 'successfully:completed',
  CompletedWithError = 'completed:with:error',
  Rescheduled = 'rescheduled',
  Cancelled = 'cancelled',
  AssistantChanged = 'assistant:changed'
}