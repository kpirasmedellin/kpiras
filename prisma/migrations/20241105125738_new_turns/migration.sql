-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('PENDIENTE', 'CERRADO');

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "turnoId" INTEGER,
ALTER COLUMN "clientId" DROP NOT NULL,
ALTER COLUMN "descuento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Kitchen" ADD COLUMN     "observaciones" TEXT;

-- CreateTable
CREATE TABLE "Turno" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaFin" TIMESTAMP(3),
    "estado" "EstadoTurno" NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Turno_codigo_key" ON "Turno"("codigo");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE SET NULL ON UPDATE CASCADE;
