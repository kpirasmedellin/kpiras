/*
  Warnings:

  - You are about to drop the column `consecutivo` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "consecutivo";

-- CreateTable
CREATE TABLE "KitchenProducts" (
    "id" SERIAL NOT NULL,
    "kitchenId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "KitchenProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceProducts" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "InvoiceProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KitchenProducts" ADD CONSTRAINT "KitchenProducts_kitchenId_fkey" FOREIGN KEY ("kitchenId") REFERENCES "Kitchen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenProducts" ADD CONSTRAINT "KitchenProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProducts" ADD CONSTRAINT "InvoiceProducts_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProducts" ADD CONSTRAINT "InvoiceProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
