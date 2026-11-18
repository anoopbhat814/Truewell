-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'CLINICIAN', 'NURSE', 'FRONT_DESK', 'BILLING', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'PATIENT',
  "display_name" TEXT NOT NULL,
  "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
  "last_login_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "user_agent" TEXT,
  "ip_address" TEXT,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "npi" TEXT,
  "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address_line1" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "postal_code" TEXT NOT NULL,
  "phone" TEXT,
  CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "mrn" TEXT NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "date_of_birth" DATE NOT NULL,
  "sex_at_birth" TEXT,
  "phone" TEXT,
  "preferred_lang" TEXT NOT NULL DEFAULT 'en',
  "primary_clinician_id" TEXT,
  "deactivated_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinicians" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "npi" TEXT NOT NULL,
  "specialty" TEXT NOT NULL,
  "title" TEXT,
  "accepting_new" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "clinicians_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_npi_key" ON "organizations"("npi");

-- CreateIndex
CREATE INDEX "locations_organization_id_idx" ON "locations"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_mrn_key" ON "patients"("mrn");

-- CreateIndex
CREATE INDEX "patients_last_name_first_name_idx" ON "patients"("last_name", "first_name");

-- CreateIndex
CREATE INDEX "patients_primary_clinician_id_idx" ON "patients"("primary_clinician_id");

-- CreateIndex
CREATE UNIQUE INDEX "clinicians_user_id_key" ON "clinicians"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "clinicians_npi_key" ON "clinicians"("npi");

-- CreateIndex
CREATE INDEX "clinicians_organization_id_specialty_idx" ON "clinicians"("organization_id", "specialty");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_primary_clinician_id_fkey" FOREIGN KEY ("primary_clinician_id") REFERENCES "clinicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinicians" ADD CONSTRAINT "clinicians_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinicians" ADD CONSTRAINT "clinicians_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
