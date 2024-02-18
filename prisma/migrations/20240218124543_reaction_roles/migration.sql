-- CreateTable
CREATE TABLE "ReactionRoles" (
    "roleID" TEXT NOT NULL PRIMARY KEY,
    "serverID" TEXT NOT NULL,
    CONSTRAINT "ReactionRoles_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
