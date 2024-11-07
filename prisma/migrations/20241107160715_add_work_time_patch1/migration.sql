-- CreateTable
CREATE TABLE "WorkTime" (
    "workTimeID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" TEXT NOT NULL,
    "serverID" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "workTime" INTEGER NOT NULL,
    "comment" TEXT,
    "dateWorkTime" DATETIME NOT NULL,
    CONSTRAINT "WorkTime_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
