-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'anonymous',
    "value" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Role" ("id", "type") SELECT "id", "type" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
CREATE UNIQUE INDEX "Role_type_key" ON "Role"("type");
CREATE UNIQUE INDEX "Role_value_key" ON "Role"("value");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
