/*
  Warnings:

  - Added the required column `serial` to the `Palette` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Palette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serial" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Palette_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Palette" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", "name", "updatedAt", "userId" FROM "Palette";
DROP TABLE "Palette";
ALTER TABLE "new_Palette" RENAME TO "Palette";
CREATE UNIQUE INDEX "Palette_serial_key" ON "Palette"("serial");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
