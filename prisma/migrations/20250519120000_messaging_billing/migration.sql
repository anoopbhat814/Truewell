-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'ACCEPTED', 'DENIED', 'PAID', 'APPEALED');

-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationKind" AS ENUM ('APPOINTMENT', 'LAB_RESULT', 'MESSAGE', 'PRESCRIPTION', 'BILLING', 'SYSTEM');

-- CreateTable
CREATE TABLE "message_threads" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "clinician_id" TEXT,
  "subject" TEXT NOT NULL,
  "archived" BOOLEAN NOT NULL DEFAULT false,
  "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "message_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
  "id" TEXT NOT NULL,
  "thread_id" TEXT NOT NULL,
  "sender_id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "read_at" TIMESTAMP(3),
  "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachments" (
  "id" TEXT NOT NULL,
  "message_id" TEXT NOT NULL,
  "file_name" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "storage_key" TEXT NOT NULL,
  CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "storage_key" TEXT NOT NULL,
  "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_policies" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "payer_name" TEXT NOT NULL,
  "member_id" TEXT NOT NULL,
  "group_number" TEXT,
  "plan_type" TEXT NOT NULL,
  "copay_cents" INTEGER NOT NULL DEFAULT 0,
  "deductible_cents" INTEGER NOT NULL DEFAULT 0,
  "effective_on" DATE NOT NULL,
  "terminates_on" DATE,
  CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "policy_id" TEXT NOT NULL,
  "appointment_id" TEXT,
  "status" "ClaimStatus" NOT NULL DEFAULT 'DRAFT',
  "total_cents" INTEGER NOT NULL,
  "allowed_cents" INTEGER,
  "paid_cents" INTEGER,
  "denial_code" TEXT,
  "submitted_at" TIMESTAMP(3),
  "adjudicated_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_lines" (
  "id" TEXT NOT NULL,
  "claim_id" TEXT NOT NULL,
  "cpt_code" TEXT NOT NULL,
  "icd10_code" TEXT NOT NULL,
  "units" INTEGER NOT NULL DEFAULT 1,
  "charge_cents" INTEGER NOT NULL,
  CONSTRAINT "claim_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "appointment_id" TEXT,
  "channel" "ReminderChannel" NOT NULL,
  "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
  "message" TEXT NOT NULL,
  "send_at" TIMESTAMP(3) NOT NULL,
  "sent_at" TIMESTAMP(3),
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "last_error" TEXT,
  CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "kind" "NotificationKind" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "actor_id" TEXT,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT NOT NULL,
  "ip_address" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "message_threads_patient_id_last_message_at_idx" ON "message_threads"("patient_id", "last_message_at");

-- CreateIndex
CREATE INDEX "message_threads_clinician_id_last_message_at_idx" ON "message_threads"("clinician_id", "last_message_at");

-- CreateIndex
CREATE INDEX "messages_thread_id_sent_at_idx" ON "messages"("thread_id", "sent_at");

-- CreateIndex
CREATE UNIQUE INDEX "message_attachments_storage_key_key" ON "message_attachments"("storage_key");

-- CreateIndex
CREATE INDEX "message_attachments_message_id_idx" ON "message_attachments"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_storage_key_key" ON "documents"("storage_key");

-- CreateIndex
CREATE INDEX "documents_patient_id_category_idx" ON "documents"("patient_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policies_payer_name_member_id_key" ON "insurance_policies"("payer_name", "member_id");

-- CreateIndex
CREATE INDEX "insurance_policies_patient_id_idx" ON "insurance_policies"("patient_id");

-- CreateIndex
CREATE INDEX "claims_patient_id_status_idx" ON "claims"("patient_id", "status");

-- CreateIndex
CREATE INDEX "claims_status_submitted_at_idx" ON "claims"("status", "submitted_at");

-- CreateIndex
CREATE INDEX "claim_lines_claim_id_idx" ON "claim_lines"("claim_id");

-- CreateIndex
CREATE INDEX "reminders_status_send_at_idx" ON "reminders"("status", "send_at");

-- CreateIndex
CREATE INDEX "reminders_patient_id_idx" ON "reminders"("patient_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at");

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "insurance_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_lines" ADD CONSTRAINT "claim_lines_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
