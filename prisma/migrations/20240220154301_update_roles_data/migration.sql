/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `roleID` on the `Ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticketID]` on the table `TicketMessage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serverID]` on the table `Welcome` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Role";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "WelcomeRole" (
    "roleID" TEXT NOT NULL PRIMARY KEY,
    "serverID" TEXT NOT NULL,
    CONSTRAINT "WelcomeRole_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RolesToTicket" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RolesToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "Roles" ("roleID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RolesToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket" ("ticketID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "ticketID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "messageID" TEXT,
    "TicketMessageID" INTEGER,
    CONSTRAINT "Ticket_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("TicketMessageID", "description", "messageID", "serverID", "ticketID", "title") SELECT "TicketMessageID", "description", "messageID", "serverID", "ticketID", "title" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "WelcomeRole_serverID_key" ON "WelcomeRole"("serverID");

-- CreateIndex
CREATE UNIQUE INDEX "_RolesToTicket_AB_unique" ON "_RolesToTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_RolesToTicket_B_index" ON "_RolesToTicket"("B");

-- CreateIndex
CREATE UNIQUE INDEX "TicketMessage_ticketID_key" ON "TicketMessage"("ticketID");

-- CreateIndex
CREATE UNIQUE INDEX "Welcome_serverID_key" ON "Welcome"("serverID");
