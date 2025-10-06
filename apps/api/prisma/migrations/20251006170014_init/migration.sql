-- CreateTable
CREATE TABLE "YellowBookCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "YellowBookTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "YellowBookEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "streetAddress" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "googleMapUrl" TEXT,
    "hours" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "kind" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YellowBookEntry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "YellowBookCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YellowBookEntryTag" (
    "entryId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("entryId", "tagId"),
    CONSTRAINT "YellowBookEntryTag_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "YellowBookEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "YellowBookEntryTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "YellowBookTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "YellowBookCategory_slug_key" ON "YellowBookCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "YellowBookTag_label_key" ON "YellowBookTag"("label");
