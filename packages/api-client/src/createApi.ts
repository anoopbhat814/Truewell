import { createHttpClient, type HttpClientOptions } from './http';
import {
  appointmentsApi,
  appointmentTypesApi,
  availabilitySlotsApi,
  telehealthSessionsApi,
  prescriptionsApi,
  medicationsApi,
  pharmaciesApi,
  allergiesApi,
  labOrdersApi,
  labResultsApi,
  carePlansApi,
  carePlanGoalsApi,
  carePlanTasksApi,
  messageThreadsApi,
  messagesApi,
  documentsApi,
  insurancePoliciesApi,
  claimsApi,
  remindersApi,
  notificationsApi,
  patientsApi,
  cliniciansApi,
} from './resources';

export function createApi(options: HttpClientOptions = {}) {
  const http = createHttpClient(options);
  return {
    http,
    appointments: appointmentsApi(http),
    appointmentTypes: appointmentTypesApi(http),
    availabilitySlots: availabilitySlotsApi(http),
    telehealthSessions: telehealthSessionsApi(http),
    prescriptions: prescriptionsApi(http),
    medications: medicationsApi(http),
    pharmacies: pharmaciesApi(http),
    allergies: allergiesApi(http),
    labOrders: labOrdersApi(http),
    labResults: labResultsApi(http),
    carePlans: carePlansApi(http),
    carePlanGoals: carePlanGoalsApi(http),
    carePlanTasks: carePlanTasksApi(http),
    messageThreads: messageThreadsApi(http),
    messages: messagesApi(http),
    documents: documentsApi(http),
    insurancePolicies: insurancePoliciesApi(http),
    claims: claimsApi(http),
    reminders: remindersApi(http),
    notifications: notificationsApi(http),
    patients: patientsApi(http),
    clinicians: cliniciansApi(http),
  };
}

export type TruewellApi = ReturnType<typeof createApi>;
