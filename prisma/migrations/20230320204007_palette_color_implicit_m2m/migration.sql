/*
  Warnings:

  - You are about to drop the column `paletteId` on the `Color` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ColorToPalette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ColorToPalette_A_fkey" FOREIGN KEY ("A") REFERENCES "Color" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ColorToPalette_B_fkey" FOREIGN KEY ("B") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "text" TEXT
);
INSERT INTO "new_Color" ("cmyk", "complement", "contrast", "hex", "hsl", "hsv", "id", "name", "rgb", "text") SELECT "cmyk", "complement", "contrast", "hex", "hsl", "hsv", "id", "name", "rgb", "text" FROM "Color";
DROP TABLE "Color";
ALTER TABLE "new_Color" RENAME TO "Color";
CREATE UNIQUE INDEX "Color_hex_key" ON "Color"("hex");
CREATE UNIQUE INDEX "Color_rgb_key" ON "Color"("rgb");
CREATE UNIQUE INDEX "Color_hsl_key" ON "Color"("hsl");
CREATE UNIQUE INDEX "Color_cmyk_key" ON "Color"("cmyk");
CREATE UNIQUE INDEX "Color_hsv_key" ON "Color"("hsv");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToPalette_AB_unique" ON "_ColorToPalette"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorToPalette_B_index" ON "_ColorToPalette"("B");
