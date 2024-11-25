/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Product` table. All the data in the column will be lost.
  - The `estado` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "cantidad",
DROP COLUMN "estado",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'ACTIVO';
