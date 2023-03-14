/*
  Warnings:

  - You are about to drop the column `private` on the `Palette` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Palette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "serial" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'public',
    "userId" TEXT NOT NULL,
    CONSTRAINT "Palette_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Palette" ("createdAt", "id", "name", "serial", "updatedAt", "userId") SELECT "createdAt", "id", "name", "serial", "updatedAt", "userId" FROM "Palette";
DROP TABLE "Palette";
ALTER TABLE "new_Palette" RENAME TO "Palette";
CREATE UNIQUE INDEX "Palette_serial_key" ON "Palette"("serial");
CREATE UNIQUE INDEX "Palette_name_key" ON "Palette"("name");
CREATE UNIQUE INDEX "Palette_userId_key" ON "Palette"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
