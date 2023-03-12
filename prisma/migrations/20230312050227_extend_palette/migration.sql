-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Color" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hex" TEXT NOT NULL,
    "rgb" TEXT NOT NULL,
    "hsl" TEXT NOT NULL,
    "cmyk" TEXT NOT NULL,
    "hsv" TEXT NOT NULL,
    "name" TEXT,
    "contrast" TEXT,
    "complement" TEXT,
    "text" TEXT,
    "paletteId" TEXT,
    CONSTRAINT "Color_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Color" ("cmyk", "complement", "contrast", "hex", "hsl", "hsv", "id", "name", "paletteId", "rgb", "text") SELECT "cmyk", "complement", "contrast", "hex", "hsl", "hsv", "id", "name", "paletteId", "rgb", "text" FROM "Color";
DROP TABLE "Color";
ALTER TABLE "new_Color" RENAME TO "Color";
CREATE UNIQUE INDEX "Color_hex_key" ON "Color"("hex");
CREATE UNIQUE INDEX "Color_rgb_key" ON "Color"("rgb");
CREATE UNIQUE INDEX "Color_hsl_key" ON "Color"("hsl");
CREATE UNIQUE INDEX "Color_cmyk_key" ON "Color"("cmyk");
CREATE UNIQUE INDEX "Color_hsv_key" ON "Color"("hsv");
CREATE TABLE "new_Palette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Palette_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Palette" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Palette";
DROP TABLE "Palette";
ALTER TABLE "new_Palette" RENAME TO "Palette";
CREATE UNIQUE INDEX "Palette_name_key" ON "Palette"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
