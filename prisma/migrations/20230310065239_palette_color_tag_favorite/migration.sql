-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hex" TEXT NOT NULL,
    "rgb" TEXT NOT NULL,
    "hsl" TEXT NOT NULL,
    "cmyk" TEXT NOT NULL,
    "hsv" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contrast" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "paletteId" TEXT,
    CONSTRAINT "Color_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Palette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paletteId" TEXT,
    "colorId" TEXT,
    "paletteCount" INTEGER DEFAULT 0,
    "colorCount" INTEGER DEFAULT 0,
    CONSTRAINT "Tag_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tag_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "paletteId" TEXT,
    "colorId" TEXT,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_hex_key" ON "Color"("hex");

-- CreateIndex
CREATE UNIQUE INDEX "Color_rgb_key" ON "Color"("rgb");

-- CreateIndex
CREATE UNIQUE INDEX "Color_hsl_key" ON "Color"("hsl");

-- CreateIndex
CREATE UNIQUE INDEX "Color_cmyk_key" ON "Color"("cmyk");

-- CreateIndex
CREATE UNIQUE INDEX "Color_hsv_key" ON "Color"("hsv");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
