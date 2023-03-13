/*
  Warnings:

  - A unique constraint covering the columns `[userId,paletteId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,colorId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,paletteId]` on the table `Forked` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,paletteId]` on the table `Owned` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,paletteId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,colorId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tag_paletteId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_paletteId_key" ON "Favorite"("userId", "paletteId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_colorId_key" ON "Favorite"("userId", "colorId");

-- CreateIndex
CREATE UNIQUE INDEX "Forked_userId_paletteId_key" ON "Forked"("userId", "paletteId");

-- CreateIndex
CREATE UNIQUE INDEX "Owned_userId_paletteId_key" ON "Owned"("userId", "paletteId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_paletteId_key" ON "Tag"("name", "paletteId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_colorId_key" ON "Tag"("name", "colorId");
