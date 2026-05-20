-- CreateTable
CREATE TABLE "JobCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JobPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'İstanbul',
    "district" TEXT NOT NULL DEFAULT 'Pendik',
    "neighborhood" TEXT NOT NULL,
    "mapLocationUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "workDate" DATETIME,
    "startTime" TEXT,
    "endTime" TEXT,
    "salaryAmount" REAL,
    "salaryType" TEXT NOT NULL DEFAULT 'not_specified',
    "neededPeopleCount" INTEGER NOT NULL DEFAULT 1,
    "experienceRequired" BOOLEAN NOT NULL DEFAULT false,
    "benefits" TEXT NOT NULL DEFAULT '',
    "contactMethod" TEXT NOT NULL DEFAULT 'phone',
    "status" TEXT NOT NULL DEFAULT 'active',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobPost_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JobPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JobCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_slug_key" ON "JobCategory"("slug");

-- CreateIndex
CREATE INDEX "JobPost_status_expiresAt_idx" ON "JobPost"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "JobPost_categoryId_status_idx" ON "JobPost"("categoryId", "status");

-- CreateIndex
CREATE INDEX "JobPost_neighborhood_status_idx" ON "JobPost"("neighborhood", "status");
