export interface AppointmentType {
  id: string;
  code: string;
  label: string;
  durationMinutes: number;
  telehealthOk: boolean;
  priceCents: number;
}

export interface AppointmentTypeInput {
  code: string;
  label: string;
  durationMinutes: number;
  telehealthOk?: boolean;
  priceCents?: number;
}

export type AppointmentTypePatch = Partial<AppointmentTypeInput>;
