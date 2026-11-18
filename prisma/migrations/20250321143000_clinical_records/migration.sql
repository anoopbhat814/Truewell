-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('DRAFT', 'SENT', 'FILLED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LabStatus" AS ENUM ('ORDERED', 'COLLECTED', 'IN_PROCESS', 'RESULTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AbnormalFlag" AS ENUM ('NORMAL', 'LOW', 'HIGH', 'CRITICAL_LOW', 'CRITICAL_HIGH');

-- CreateEnum
CREATE TYPE "CarePlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'REVOKED');

-- CreateTable
CREATE TABLE "medications" (
  "id" TEXT NOT NULL,
  "rxnorm_code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "strength" TEXT,
  "form" TEXT,
  "is_controlled" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacies" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "ncpdp_id" TEXT NOT NULL,
  "phone" TEXT,
  "city" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "clinician_id" TEXT NOT NULL,
  "medication_id" TEXT NOT NULL,
  "pharmacy_id" TEXT,
  "status" "PrescriptionStatus" NOT NULL DEFAULT 'DRAFT',
  "dosage" TEXT NOT NULL,
  "frequency" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "refills" INTEGER NOT NULL DEFAULT 0,
  "instructions" TEXT,
  "issued_at" TIMESTAMP(3),
  "expires_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergies" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "substance" TEXT NOT NULL,
  "reaction" TEXT,
  "severity" TEXT NOT NULL DEFAULT 'moderate',
  "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "allergies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_orders" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "clinician_id" TEXT NOT NULL,
  "status" "LabStatus" NOT NULL DEFAULT 'ORDERED',
  "panel_code" TEXT NOT NULL,
  "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "collected_at" TIMESTAMP(3),
  CONSTRAINT "lab_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
  "id" TEXT NOT NULL,
  "order_id" TEXT NOT NULL,
  "analyte" TEXT NOT NULL,
  "loinc_code" TEXT,
  "value" DECIMAL(12,4) NOT NULL,
  "unit" TEXT NOT NULL,
  "ref_low" DECIMAL(12,4),
  "ref_high" DECIMAL(12,4),
  "flag" "AbnormalFlag" NOT NULL DEFAULT 'NORMAL',
  "resulted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "released_to_patient" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plans" (
  "id" TEXT NOT NULL,
  "patient_id" TEXT NOT NULL,
  "clinician_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" "CarePlanStatus" NOT NULL DEFAULT 'DRAFT',
  "starts_on" DATE NOT NULL,
  "ends_on" DATE,
  "summary" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "care_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plan_goals" (
  "id" TEXT NOT NULL,
  "care_plan_id" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "metric" TEXT,
  "target_value" DECIMAL(12,4),
  "target_date" DATE,
  "achieved_at" TIMESTAMP(3),
  CONSTRAINT "care_plan_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plan_tasks" (
  "id" TEXT NOT NULL,
  "care_plan_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "assignee" "Role" NOT NULL DEFAULT 'PATIENT',
  "due_on" DATE,
  "completed_at" TIMESTAMP(3),
  CONSTRAINT "care_plan_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medications_rxnorm_code_key" ON "medications"("rxnorm_code");

-- CreateIndex
CREATE INDEX "medications_name_idx" ON "medications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_ncpdp_id_key" ON "pharmacies"("ncpdp_id");

-- CreateIndex
CREATE INDEX "prescriptions_patient_id_status_idx" ON "prescriptions"("patient_id", "status");

-- CreateIndex
CREATE INDEX "prescriptions_clinician_id_idx" ON "prescriptions"("clinician_id");

-- CreateIndex
CREATE UNIQUE INDEX "allergies_patient_id_substance_key" ON "allergies"("patient_id", "substance");

-- CreateIndex
CREATE INDEX "lab_orders_patient_id_status_idx" ON "lab_orders"("patient_id", "status");

-- CreateIndex
CREATE INDEX "lab_results_order_id_idx" ON "lab_results"("order_id");

-- CreateIndex
CREATE INDEX "lab_results_analyte_resulted_at_idx" ON "lab_results"("analyte", "resulted_at");

-- CreateIndex
CREATE INDEX "care_plans_patient_id_status_idx" ON "care_plans"("patient_id", "status");

-- CreateIndex
CREATE INDEX "care_plan_goals_care_plan_id_idx" ON "care_plan_goals"("care_plan_id");

-- CreateIndex
CREATE INDEX "care_plan_tasks_care_plan_id_completed_at_idx" ON "care_plan_tasks"("care_plan_id", "completed_at");

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "lab_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_goals" ADD CONSTRAINT "care_plan_goals_care_plan_id_fkey" FOREIGN KEY ("care_plan_id") REFERENCES "care_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_tasks" ADD CONSTRAINT "care_plan_tasks_care_plan_id_fkey" FOREIGN KEY ("care_plan_id") REFERENCES "care_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
