import type { NotificationKind } from './enums';

export interface Notification {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  readAt: string | null;
}

export interface NotificationInput {
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  readAt?: string | null;
}

export type NotificationPatch = Partial<NotificationInput>;
