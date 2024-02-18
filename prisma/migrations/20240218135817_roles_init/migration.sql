/*
  Warnings:

  - The primary key for the `ReactionRoles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleID` on the `ReactionRoles` table. All the data in the column will be lost.
  - Added the required column `reactionRoleID` to the `ReactionRoles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Roles" (
    "roleID" TEXT NOT NULL PRIMARY KEY,
    "serverID" TEXT NOT NULL,
    CONSTRAINT "Roles_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ReactionRolesToRoles" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ReactionRolesToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "ReactionRoles" ("reactionRoleID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ReactionRolesToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles" ("roleID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReactionRoles" (
    "reactionRoleID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverID" TEXT NOT NULL,
    "messageID" TEXT,
    CONSTRAINT "ReactionRoles_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReactionRoles" ("messageID", "serverID") SELECT "messageID", "serverID" FROM "ReactionRoles";
DROP TABLE "ReactionRoles";
ALTER TABLE "new_ReactionRoles" RENAME TO "ReactionRoles";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ReactionRolesToRoles_AB_unique" ON "_ReactionRolesToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_ReactionRolesToRoles_B_index" ON "_ReactionRolesToRoles"("B");
