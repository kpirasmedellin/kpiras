/*
  Warnings:

  - You are about to drop the `_InvoiceToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_KitchenToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `costo` to the `InvoiceProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `InvoiceProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costo` to the `KitchenProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `KitchenProducts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_InvoiceToProduct" DROP CONSTRAINT "_InvoiceToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_InvoiceToProduct" DROP CONSTRAINT "_InvoiceToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_KitchenToProduct" DROP CONSTRAINT "_KitchenToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_KitchenToProduct" DROP CONSTRAINT "_KitchenToProduct_B_fkey";

-- AlterTable
ALTER TABLE "InvoiceProducts" ADD COLUMN     "costo" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "KitchenProducts" ADD COLUMN     "costo" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "_InvoiceToProduct";

-- DropTable
DROP TABLE "_KitchenToProduct";

-- DropEnum
DROP TYPE "EstadoProducto";
