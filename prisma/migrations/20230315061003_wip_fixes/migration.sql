-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'ANON',
    "level" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Role" ("id", "level", "type") SELECT "id", "level", "type" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
CREATE UNIQUE INDEX "Role_type_key" ON "Role"("type");
CREATE UNIQUE INDEX "Role_level_key" ON "Role"("level");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
