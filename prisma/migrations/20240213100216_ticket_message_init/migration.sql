-- CreateTable
CREATE TABLE "Server" (
    "serverID" TEXT NOT NULL PRIMARY KEY,
    "serverName" TEXT NOT NULL,
    "enable_xp" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Welcome" (
    "channelID" TEXT NOT NULL PRIMARY KEY,
    "serverID" TEXT NOT NULL,
    CONSTRAINT "Welcome_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "roleID" TEXT NOT NULL PRIMARY KEY,
    "serverID" TEXT NOT NULL,
    CONSTRAINT "Role_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WarnList" (
    "warnID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" TEXT NOT NULL,
    "authorID" TEXT NOT NULL,
    "reason" TEXT,
    "dateWarn" DATETIME NOT NULL,
    "serverID" TEXT NOT NULL,
    CONSTRAINT "WarnList_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Experience" (
    "userID" TEXT NOT NULL,
    "serverID" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,

    PRIMARY KEY ("userID", "serverID"),
    CONSTRAINT "Experience_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticketID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverID" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "roleID" TEXT NOT NULL,
    "categoryID" TEXT,
    "messageID" INTEGER,
    CONSTRAINT "Ticket_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "messageID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticketID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "TicketMessage_ticketID_fkey" FOREIGN KEY ("ticketID") REFERENCES "Ticket" ("ticketID") ON DELETE RESTRICT ON UPDATE CASCADE
);
