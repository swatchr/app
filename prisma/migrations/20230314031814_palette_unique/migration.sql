-- DropIndex
DROP INDEX "Fork_userId_paletteId_key";

-- CreateIndex
CREATE INDEX "Palette_userId_serial_idx" ON "Palette"("userId", "serial");
