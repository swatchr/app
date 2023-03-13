/*
  Warnings:

  - Made the column `userId` on table `Palette` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Palette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serial" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "private" BOOLEAN DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Palette_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Palette" ("createdAt", "id", "name", "private", "serial", "updatedAt", "userId") SELECT "createdAt", "id", "name", "private", "serial", "updatedAt", "userId" FROM "Palette";
DROP TABLE "Palette";
ALTER TABLE "new_Palette" RENAME TO "Palette";
CREATE UNIQUE INDEX "Palette_serial_key" ON "Palette"("serial");
CREATE UNIQUE INDEX "Palette_name_key" ON "Palette"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
