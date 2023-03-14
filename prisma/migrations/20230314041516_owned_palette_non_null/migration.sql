/*
  Warnings:

  - Made the column `paletteId` on table `Owned` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Owned" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "paletteId" TEXT NOT NULL,
    CONSTRAINT "Owned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Owned_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Owned" ("createdAt", "id", "paletteId", "updatedAt", "userId") SELECT "createdAt", "id", "paletteId", "updatedAt", "userId" FROM "Owned";
DROP TABLE "Owned";
ALTER TABLE "new_Owned" RENAME TO "Owned";
CREATE UNIQUE INDEX "Owned_userId_paletteId_key" ON "Owned"("userId", "paletteId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
