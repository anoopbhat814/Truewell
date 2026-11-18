export interface Pharmacy {
  id: string;
  name: string;
  ncpdpId: string;
  phone: string | null;
  city: string;
  region: string;
}

export interface PharmacyInput {
  name: string;
  ncpdpId: string;
  phone?: string | null;
  city: string;
  region: string;
}

export type PharmacyPatch = Partial<PharmacyInput>;
