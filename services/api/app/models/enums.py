from enum import Enum


class AppointmentStatus(str, Enum):
    REQUESTED = "REQUESTED"
    CONFIRMED = "CONFIRMED"
    CHECKED_IN = "CHECKED_IN"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class AppointmentMode(str, Enum):
    IN_PERSON = "IN_PERSON"
    VIDEO = "VIDEO"
    PHONE = "PHONE"


class SessionStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    WAITING_ROOM = "WAITING_ROOM"
    LIVE = "LIVE"
    ENDED = "ENDED"
    FAILED = "FAILED"


class PrescriptionStatus(str, Enum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"


class LabStatus(str, Enum):
    ORDERED = "ORDERED"
    COLLECTED = "COLLECTED"
    IN_PROCESS = "IN_PROCESS"
    RESULTED = "RESULTED"
    CANCELLED = "CANCELLED"


class AbnormalFlag(str, Enum):
    NORMAL = "NORMAL"
    LOW = "LOW"
    HIGH = "HIGH"
    CRITICAL_LOW = "CRITICAL_LOW"
    CRITICAL_HIGH = "CRITICAL_HIGH"


class CarePlanStatus(str, Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    REVOKED = "REVOKED"


class ClaimStatus(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    ACCEPTED = "ACCEPTED"
    DENIED = "DENIED"
    PAID = "PAID"
    APPEALED = "APPEALED"


class ReminderChannel(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"
    PUSH = "PUSH"


class ReminderStatus(str, Enum):
    PENDING = "PENDING"
    SENT = "SENT"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class NotificationKind(str, Enum):
    APPOINTMENT = "APPOINTMENT"
    LAB_RESULT = "LAB_RESULT"
    MESSAGE = "MESSAGE"
    PRESCRIPTION = "PRESCRIPTION"
    BILLING = "BILLING"
    SYSTEM = "SYSTEM"
