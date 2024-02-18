/*
  Warnings:

  - Added the required column `messageID` to the `ReactionRoles` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReactionRoles" (
    "roleID" TEXT NOT NULL PRIMARY KEY,
    "serverID" TEXT NOT NULL,
    "messageID" TEXT NOT NULL,
    CONSTRAINT "ReactionRoles_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReactionRoles" ("roleID", "serverID") SELECT "roleID", "serverID" FROM "ReactionRoles";
DROP TABLE "ReactionRoles";
ALTER TABLE "new_ReactionRoles" RENAME TO "ReactionRoles";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
