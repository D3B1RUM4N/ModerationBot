/*
  Warnings:

  - Made the column `categoryID` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "ticketID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "roleID" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "messageID" INTEGER,
    CONSTRAINT "Ticket_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("categoryID", "description", "messageID", "roleID", "serverID", "ticketID", "title") SELECT "categoryID", "description", "messageID", "roleID", "serverID", "ticketID", "title" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
