-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WelcomeRole" (
    "roleID" TEXT NOT NULL PRIMARY KEY,
    "serverID" TEXT NOT NULL,
    CONSTRAINT "WelcomeRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Roles" ("roleID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WelcomeRole_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WelcomeRole" ("roleID", "serverID") SELECT "roleID", "serverID" FROM "WelcomeRole";
DROP TABLE "WelcomeRole";
ALTER TABLE "new_WelcomeRole" RENAME TO "WelcomeRole";
CREATE UNIQUE INDEX "WelcomeRole_serverID_key" ON "WelcomeRole"("serverID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
