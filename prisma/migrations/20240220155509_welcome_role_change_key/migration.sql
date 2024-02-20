/*
  Warnings:

  - The primary key for the `WelcomeRole` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WelcomeRole" (
    "serverID" TEXT NOT NULL PRIMARY KEY,
    "roleID" TEXT NOT NULL,
    CONSTRAINT "WelcomeRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Roles" ("roleID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WelcomeRole_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WelcomeRole" ("roleID", "serverID") SELECT "roleID", "serverID" FROM "WelcomeRole";
DROP TABLE "WelcomeRole";
ALTER TABLE "new_WelcomeRole" RENAME TO "WelcomeRole";
CREATE UNIQUE INDEX "WelcomeRole_roleID_key" ON "WelcomeRole"("roleID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
