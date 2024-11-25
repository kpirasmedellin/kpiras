-- DropForeignKey
ALTER TABLE "Kitchen" DROP CONSTRAINT "Kitchen_clientId_fkey";

-- AlterTable
ALTER TABLE "Kitchen" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Kitchen" ADD CONSTRAINT "Kitchen_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
