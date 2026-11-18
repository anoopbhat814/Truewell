import { PrismaClient, Role, AppointmentStatus, AppointmentMode, LabStatus, AbnormalFlag } from '@prisma/client';
import { createHash } from 'node:crypto';

const prisma = new PrismaClient();

// All identities below are fictional and use reserved *.example addresses.
const hash = (pw: string) => createHash('sha256').update(`truewell-seed:${pw}`).digest('hex');
const daysFromNow = (d: number, hour = 9) => {
  const t = new Date();
  t.setUTCDate(t.getUTCDate() + d);
  t.setUTCHours(hour, 0, 0, 0);
  return t;
};

const APPOINTMENT_TYPES = [
  { code: 'NEW_PATIENT', label: 'New patient visit', durationMinutes: 45, telehealthOk: false, priceCents: 24000 },
  { code: 'FOLLOW_UP', label: 'Follow-up visit', durationMinutes: 20, telehealthOk: true, priceCents: 11000 },
  { code: 'TELEHEALTH_CHECK', label: 'Telehealth check-in', durationMinutes: 15, telehealthOk: true, priceCents: 8500 },
  { code: 'ANNUAL_PHYSICAL', label: 'Annual physical', durationMinutes: 40, telehealthOk: false, priceCents: 19500 },
];

const MEDICATIONS = [
  { rxnormCode: '860975', name: 'Metformin Hydrochloride', strength: '500 mg', form: 'tablet', isControlled: false },
  { rxnormCode: '314076', name: 'Lisinopril', strength: '10 mg', form: 'tablet', isControlled: false },
  { rxnormCode: '617314', name: 'Atorvastatin Calcium', strength: '20 mg', form: 'tablet', isControlled: false },
  { rxnormCode: '197361', name: 'Amlodipine Besylate', strength: '5 mg', form: 'tablet', isControlled: false },
  { rxnormCode: '308192', name: 'Alprazolam', strength: '0.5 mg', form: 'tablet', isControlled: true },
];

async function seedOrganization() {
  const org = await prisma.organization.upsert({
    where: { npi: '1000000001' },
    update: {},
    create: { name: 'Riverside Family Health', npi: '1000000001', timezone: 'America/Chicago' },
  });
  const existing = await prisma.location.findFirst({ where: { organizationId: org.id } });
  const location =
    existing ??
    (await prisma.location.create({
      data: {
        organizationId: org.id,
        name: 'Riverside Main Clinic',
        addressLine1: '100 Example Street',
        city: 'Springfield',
        region: 'IL',
        postalCode: '62701',
        phone: '+15555550100',
      },
    }));
  return { org, location };
}

async function seedUsers(orgId: string) {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@truewell.example' },
    update: {},
    create: { email: 'admin@truewell.example', passwordHash: hash('admin-pass'), role: Role.ADMIN, displayName: 'Avery Admin' },
  });

  const clinicianUsers = [
    { email: 'dr.rivera@truewell.example', name: 'Dr. Maya Rivera', npi: '1000000002', specialty: 'Family Medicine' },
    { email: 'dr.okafor@truewell.example', name: 'Dr. Chidi Okafor', npi: '1000000003', specialty: 'Endocrinology' },
  ];
  const clinicians = [];
  for (const c of clinicianUsers) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { email: c.email, passwordHash: hash('clinician-pass'), role: Role.CLINICIAN, displayName: c.name, mfaEnabled: true },
    });
    clinicians.push(
      await prisma.clinician.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, organizationId: orgId, npi: c.npi, specialty: c.specialty, title: 'MD' },
      }),
    );
  }

  const patientSeeds = [
    { email: 'sam.patel@patients.example', first: 'Sam', last: 'Patel', dob: '1984-03-12', mrn: 'MRN-100001' },
    { email: 'lena.fischer@patients.example', first: 'Lena', last: 'Fischer', dob: '1971-11-02', mrn: 'MRN-100002' },
    { email: 'jo.nguyen@patients.example', first: 'Jo', last: 'Nguyen', dob: '1992-07-25', mrn: 'MRN-100003' },
  ];
  const patients = [];
  for (const p of patientSeeds) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { email: p.email, passwordHash: hash('patient-pass'), role: Role.PATIENT, displayName: `${p.first} ${p.last}` },
    });
    patients.push(
      await prisma.patient.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          mrn: p.mrn,
          firstName: p.first,
          lastName: p.last,
          dateOfBirth: new Date(p.dob),
          primaryClinicianId: clinicians[0]!.id,
          phone: '+15555550123',
        },
      }),
    );
  }
  return { admin, clinicians, patients };
}

async function seedCatalog() {
  for (const t of APPOINTMENT_TYPES) {
    await prisma.appointmentType.upsert({ where: { code: t.code }, update: {}, create: t });
  }
  for (const m of MEDICATIONS) {
    await prisma.medication.upsert({ where: { rxnormCode: m.rxnormCode }, update: {}, create: m });
  }
  await prisma.pharmacy.upsert({
    where: { ncpdpId: '0000001' },
    update: {},
    create: { name: 'Corner Pharmacy', ncpdpId: '0000001', phone: '+15555550111', city: 'Springfield', region: 'IL' },
  });
}

async function seedClinical(
  patients: Awaited<ReturnType<typeof seedUsers>>['patients'],
  clinicians: Awaited<ReturnType<typeof seedUsers>>['clinicians'],
  locationId: string,
) {
  const followUp = await prisma.appointmentType.findUniqueOrThrow({ where: { code: 'FOLLOW_UP' } });
  const tele = await prisma.appointmentType.findUniqueOrThrow({ where: { code: 'TELEHEALTH_CHECK' } });
  const metformin = await prisma.medication.findUniqueOrThrow({ where: { rxnormCode: '860975' } });
  const clinician = clinicians[0]!;
  const patient = patients[0]!;

  for (let i = 1; i <= 5; i++) {
    const startsAt = daysFromNow(i, 14);
    await prisma.availabilitySlot.upsert({
      where: { clinicianId_startsAt: { clinicianId: clinician.id, startsAt } },
      update: {},
      create: { clinicianId: clinician.id, startsAt, endsAt: new Date(startsAt.getTime() + 20 * 60_000) },
    });
  }

  const visit = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      clinicianId: clinician.id,
      typeId: tele.id,
      status: AppointmentStatus.CONFIRMED,
      mode: AppointmentMode.VIDEO,
      startsAt: daysFromNow(2, 15),
      endsAt: daysFromNow(2, 15),
      reason: 'Blood pressure review',
    },
  });
  await prisma.telehealthSession.create({ data: { appointmentId: visit.id, roomName: `tw-${visit.id.slice(-8)}` } });
  await prisma.appointment.create({
    data: {
      patientId: patients[1]!.id,
      clinicianId: clinician.id,
      typeId: followUp.id,
      locationId,
      status: AppointmentStatus.REQUESTED,
      startsAt: daysFromNow(6, 10),
      endsAt: daysFromNow(6, 10),
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patient.id,
      clinicianId: clinician.id,
      medicationId: metformin.id,
      dosage: '500 mg',
      frequency: 'twice daily with meals',
      quantity: 60,
      refills: 3,
      status: 'SENT',
      issuedAt: new Date(),
    },
  });

  const order = await prisma.labOrder.create({
    data: { patientId: patient.id, clinicianId: clinician.id, panelCode: 'BMP', status: LabStatus.RESULTED, collectedAt: daysFromNow(-3) },
  });
  await prisma.labResult.createMany({
    data: [
      { orderId: order.id, analyte: 'Glucose', loincCode: '2345-7', value: 118, unit: 'mg/dL', refLow: 70, refHigh: 99, flag: AbnormalFlag.HIGH, releasedToPatient: true },
      { orderId: order.id, analyte: 'Potassium', loincCode: '2823-3', value: 4.1, unit: 'mmol/L', refLow: 3.5, refHigh: 5.1, flag: AbnormalFlag.NORMAL, releasedToPatient: true },
    ],
  });

  const plan = await prisma.carePlan.create({
    data: {
      patientId: patient.id,
      clinicianId: clinician.id,
      title: 'Type 2 diabetes management',
      status: 'ACTIVE',
      startsOn: daysFromNow(-14),
      summary: 'Lifestyle changes, metformin, quarterly A1C monitoring.',
    },
  });
  await prisma.carePlanGoal.create({
    data: { carePlanId: plan.id, description: 'Reach A1C below 7.0%', metric: 'A1C', targetValue: 7.0 },
  });
  await prisma.carePlanTask.createMany({
    data: [
      { carePlanId: plan.id, title: 'Log fasting glucose daily', assignee: Role.PATIENT },
      { carePlanId: plan.id, title: 'Order quarterly A1C panel', assignee: Role.CLINICIAN },
    ],
  });

  const policy = await prisma.insurancePolicy.upsert({
    where: { payerName_memberId: { payerName: 'Example Health Plan', memberId: 'EHP-5550001' } },
    update: {},
    create: {
      patientId: patient.id,
      payerName: 'Example Health Plan',
      memberId: 'EHP-5550001',
      planType: 'PPO',
      copayCents: 3000,
      deductibleCents: 150000,
      effectiveOn: new Date('2025-01-01'),
    },
  });
  const claim = await prisma.claim.create({
    data: { patientId: patient.id, policyId: policy.id, appointmentId: visit.id, totalCents: 8500, status: 'DRAFT' },
  });
  await prisma.claimLine.create({ data: { claimId: claim.id, cptCode: '99213', icd10Code: 'E11.9', chargeCents: 8500 } });

  await prisma.reminder.create({
    data: {
      patientId: patient.id,
      appointmentId: visit.id,
      channel: 'EMAIL',
      message: 'Your telehealth visit is tomorrow at 3:00 PM.',
      sendAt: daysFromNow(1, 15),
    },
  });
}

async function main() {
  const { org, location } = await seedOrganization();
  const { clinicians, patients } = await seedUsers(org.id);
  await seedCatalog();
  await seedClinical(patients, clinicians, location.id);
  console.info(`Seeded ${patients.length} patients and ${clinicians.length} clinicians.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
