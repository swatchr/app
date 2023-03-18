/*
  Warnings:

  - A unique constraint covering the columns `[serial,name]` on the table `Palette` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Palette_serial_status_idx" ON "Palette"("serial", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Palette_serial_name_key" ON "Palette"("serial", "name");
