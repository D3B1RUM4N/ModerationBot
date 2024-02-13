-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TicketMessage" (
    "messageID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticketID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "TicketMessage_ticketID_fkey" FOREIGN KEY ("ticketID") REFERENCES "Ticket" ("ticketID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TicketMessage" ("description", "messageID", "ticketID", "title") SELECT "description", "messageID", "ticketID", "title" FROM "TicketMessage";
DROP TABLE "TicketMessage";
ALTER TABLE "new_TicketMessage" RENAME TO "TicketMessage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
