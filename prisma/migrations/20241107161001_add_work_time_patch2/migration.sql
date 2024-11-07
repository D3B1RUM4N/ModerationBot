-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkTime" (
    "workTimeID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" TEXT NOT NULL,
    "serverID" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "workTime" INTEGER NOT NULL,
    "comment" TEXT,
    "dateWorkTime" TEXT NOT NULL,
    CONSTRAINT "WorkTime_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server" ("serverID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkTime" ("comment", "dateWorkTime", "serverID", "task", "userID", "workTime", "workTimeID") SELECT "comment", "dateWorkTime", "serverID", "task", "userID", "workTime", "workTimeID" FROM "WorkTime";
DROP TABLE "WorkTime";
ALTER TABLE "new_WorkTime" RENAME TO "WorkTime";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
