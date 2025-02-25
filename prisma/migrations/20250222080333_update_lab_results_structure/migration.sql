/*
  Warnings:

  - You are about to drop the column `result` on the `LabResult` table. All the data in the column will be lost.
  - Made the column `lastName` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LabResult" DROP COLUMN "result";

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "lastName" SET NOT NULL;

-- CreateTable
CREATE TABLE "GroupResult" (
    "id" SERIAL NOT NULL,
    "labResultId" INTEGER NOT NULL,
    "conceptUuid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "orderUuid" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GroupResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupResult" ADD CONSTRAINT "GroupResult_labResultId_fkey" FOREIGN KEY ("labResultId") REFERENCES "LabResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
