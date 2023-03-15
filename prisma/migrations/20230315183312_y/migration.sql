/*
  Warnings:

  - You are about to drop the column `profileId` on the `Palette` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Palette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "serial" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'public'
);
INSERT INTO "new_Palette" ("createdAt", "id", "name", "serial", "status", "updatedAt") SELECT "createdAt", "id", "name", "serial", "status", "updatedAt" FROM "Palette";
DROP TABLE "Palette";
ALTER TABLE "new_Palette" RENAME TO "Palette";
CREATE UNIQUE INDEX "Palette_serial_key" ON "Palette"("serial");
CREATE UNIQUE INDEX "Palette_name_key" ON "Palette"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
