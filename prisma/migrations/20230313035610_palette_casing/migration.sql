/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Palette` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paletteId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Palette_userId_key" ON "Palette"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_paletteId_key" ON "Tag"("paletteId");
