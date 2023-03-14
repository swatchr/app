-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Owned" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "profileId" TEXT,
    "paletteId" TEXT NOT NULL,
    CONSTRAINT "Owned_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Owned_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Owned" ("createdAt", "id", "paletteId", "updatedAt") SELECT "createdAt", "id", "paletteId", "updatedAt" FROM "Owned";
DROP TABLE "Owned";
ALTER TABLE "new_Owned" RENAME TO "Owned";
CREATE UNIQUE INDEX "Owned_profileId_paletteId_key" ON "Owned"("profileId", "paletteId");
CREATE TABLE "new_Fork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paletteId" TEXT,
    "profileId" TEXT,
    CONSTRAINT "Fork_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Fork_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Fork" ("createdAt", "id", "paletteId", "updatedAt") SELECT "createdAt", "id", "paletteId", "updatedAt" FROM "Fork";
DROP TABLE "Fork";
ALTER TABLE "new_Fork" RENAME TO "Fork";
CREATE UNIQUE INDEX "Fork_profileId_paletteId_key" ON "Fork"("profileId", "paletteId");
CREATE TABLE "new_Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paletteId" TEXT,
    "colorId" TEXT,
    "profileId" TEXT,
    CONSTRAINT "Favorite_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Favorite" ("colorId", "createdAt", "id", "paletteId", "updatedAt") SELECT "colorId", "createdAt", "id", "paletteId", "updatedAt" FROM "Favorite";
DROP TABLE "Favorite";
ALTER TABLE "new_Favorite" RENAME TO "Favorite";
CREATE UNIQUE INDEX "Favorite_profileId_paletteId_key" ON "Favorite"("profileId", "paletteId");
CREATE UNIQUE INDEX "Favorite_profileId_colorId_key" ON "Favorite"("profileId", "colorId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "Palette_profileId_serial_idx" ON "Palette"("profileId", "serial");
