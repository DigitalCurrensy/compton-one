import { classifyResidentText, resolveRoute } from './lib/classifier';
import { buildReceipt, sanitizeResidentText, STATUS_SEQUENCE } from './lib/receipt';
import { serviceCatalog, SERVICE_IDS, EMERGENCY_GUIDANCE } from './lib/serviceCatalog';
import { analytics, lengthBucket, confidenceBand, ANALYTICS_EVENTS } from './lib/analytics';
import { createCaseStore } from './lib/storage';
import { buildReminderIcs, reminderFilename } from './lib/calendar';
(globalThis as any).C1 = { classifyResidentText, resolveRoute, buildReceipt, sanitizeResidentText, STATUS_SEQUENCE, serviceCatalog, SERVICE_IDS, EMERGENCY_GUIDANCE, analytics, lengthBucket, confidenceBand, ANALYTICS_EVENTS, createCaseStore, buildReminderIcs, reminderFilename };
