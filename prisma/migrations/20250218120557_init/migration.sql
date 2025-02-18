-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "openmrsId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "testResults" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_openmrsId_key" ON "Patient"("openmrsId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_key" ON "Patient"("phone");
