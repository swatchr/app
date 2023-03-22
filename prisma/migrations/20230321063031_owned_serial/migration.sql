/*
  Warnings:

  - You are about to drop the column `paletteId` on the `Owned` table. All the data in the column will be lost.
  - Added the required column `serial` to the `Owned` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Owned" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "profileId" TEXT,
    "serial" TEXT NOT NULL,
    CONSTRAINT "Owned_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Owned_serial_fkey" FOREIGN KEY ("serial") REFERENCES "Palette" ("serial") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Owned" ("createdAt", "id", "profileId", "updatedAt") SELECT "createdAt", "id", "profileId", "updatedAt" FROM "Owned";
DROP TABLE "Owned";
ALTER TABLE "new_Owned" RENAME TO "Owned";
CREATE UNIQUE INDEX "Owned_serial_key" ON "Owned"("serial");
CREATE UNIQUE INDEX "Owned_profileId_serial_key" ON "Owned"("profileId", "serial");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
