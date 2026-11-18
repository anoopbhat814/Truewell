-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AppointmentMode" AS ENUM ('IN_PERSON', 'VIDEO', 'PHONE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'WAITING_ROOM', 'LIVE', 'ENDED', 'FAILED');

-- CreateTable
CREATE TABLE "appointment_types" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "duration_minutes" INTEGER NOT NULL,
  "telehealth_ok" BOOLEAN NOT NULL DEFAULT true,
  "price_cents" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "appointment_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_slots" (
  "id" TEXT NOT NULL,
  "clinician_id" TEXT NOT NULL,
  "starts_at" TIMESTAMP(3) NOT NULL,
  "ends_at" TIMESTAMP(3) NOT NULL,
  "is_booked" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "clinician_id" TEXT NOT NULL,
  "type_id" TEXT NOT NULL,
  "location_id" TEXT,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'REQUESTED',
  "mode" "AppointmentMode" NOT NULL DEFAULT 'IN_PERSON',
  "starts_at" TIMESTAMP(3) NOT NULL,
  "ends_at" TIMESTAMP(3) NOT NULL,
  "reason" TEXT,
  "cancel_reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telehealth_sessions" (
  "id" TEXT NOT NULL,
  "appointment_id" TEXT NOT NULL,
  "room_name" TEXT NOT NULL,
  "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
  "started_at" TIMESTAMP(3),
  "ended_at" TIMESTAMP(3),
  "recording_consent" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "telehealth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telehealth_participants" (
  "id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "joined_at" TIMESTAMP(3),
  "left_at" TIMESTAMP(3),
  "connection_quality" INTEGER,
  CONSTRAINT "telehealth_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appointment_types_code_key" ON "appointment_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "availability_slots_clinician_id_starts_at_key" ON "availability_slots"("clinician_id", "starts_at");

-- CreateIndex
CREATE INDEX "availability_slots_starts_at_is_booked_idx" ON "availability_slots"("starts_at", "is_booked");

-- CreateIndex
CREATE INDEX "appointments_patient_id_starts_at_idx" ON "appointments"("patient_id", "starts_at");

-- CreateIndex
CREATE INDEX "appointments_clinician_id_starts_at_idx" ON "appointments"("clinician_id", "starts_at");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "telehealth_sessions_appointment_id_key" ON "telehealth_sessions"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "telehealth_sessions_room_name_key" ON "telehealth_sessions"("room_name");

-- CreateIndex
CREATE INDEX "telehealth_sessions_status_idx" ON "telehealth_sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "telehealth_participants_session_id_user_id_key" ON "telehealth_participants"("session_id", "user_id");

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "appointment_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telehealth_sessions" ADD CONSTRAINT "telehealth_sessions_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telehealth_participants" ADD CONSTRAINT "telehealth_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "telehealth_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
