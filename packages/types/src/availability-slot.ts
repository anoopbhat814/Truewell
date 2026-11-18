export interface AvailabilitySlot {
  id: string;
  clinicianId: string;
  startsAt: string;
  endsAt: string;
  isBooked: boolean;
}

export interface AvailabilitySlotInput {
  clinicianId: string;
  startsAt: string;
  endsAt: string;
  isBooked?: boolean;
}

export type AvailabilitySlotPatch = Partial<AvailabilitySlotInput>;
