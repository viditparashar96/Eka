/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Physician` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Physician` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Physician" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Physician_clerkId_key" ON "Physician"("clerkId");
