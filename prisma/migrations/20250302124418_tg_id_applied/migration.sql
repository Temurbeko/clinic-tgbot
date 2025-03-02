-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "openmrsId" TEXT NOT NULL,
    "telegramId" TEXT,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupResult" (
    "id" SERIAL NOT NULL,
    "labResultId" INTEGER NOT NULL,
    "conceptUuid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "orderUuid" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "units" TEXT,
    "hiAbsolute" DOUBLE PRECISION,
    "lowAbsolute" DOUBLE PRECISION,
    "hiNormal" DOUBLE PRECISION,
    "lowNormal" DOUBLE PRECISION,

    CONSTRAINT "GroupResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_openmrsId_key" ON "Patient"("openmrsId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_telegramId_key" ON "Patient"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_key" ON "Patient"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_firstName_lastName_key" ON "Patient"("firstName", "lastName");

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupResult" ADD CONSTRAINT "GroupResult_labResultId_fkey" FOREIGN KEY ("labResultId") REFERENCES "LabResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
