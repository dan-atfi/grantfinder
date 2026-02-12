-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserCompany" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyNumber" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyStatus" TEXT,
    "companyType" TEXT,
    "dateOfCreation" TIMESTAMP(3),
    "dateOfCessation" TIMESTAMP(3),
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "locality" TEXT,
    "region" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "rawCompaniesHouseData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySicCode" (
    "id" TEXT NOT NULL,
    "userCompanyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "section" TEXT,
    "division" TEXT,

    CONSTRAINT "CompanySicCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedGrant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grantSource" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fundingBody" TEXT,
    "amountMin" DECIMAL(15,2),
    "amountMax" DECIMAL(15,2),
    "currency" TEXT DEFAULT 'GBP',
    "openDate" TIMESTAMP(3),
    "closeDate" TIMESTAMP(3),
    "applicationUrl" TEXT,
    "categories" TEXT[],
    "rawData" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "filters" JSONB,
    "resultCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SicCodeReference" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "divisionName" TEXT NOT NULL,
    "groupCode" TEXT,
    "classCode" TEXT,

    CONSTRAINT "SicCodeReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "UserCompany_userId_key" ON "UserCompany"("userId");

-- CreateIndex
CREATE INDEX "UserCompany_companyNumber_idx" ON "UserCompany"("companyNumber");

-- CreateIndex
CREATE INDEX "CompanySicCode_code_idx" ON "CompanySicCode"("code");

-- CreateIndex
CREATE INDEX "CompanySicCode_section_idx" ON "CompanySicCode"("section");

-- CreateIndex
CREATE UNIQUE INDEX "CompanySicCode_userCompanyId_code_key" ON "CompanySicCode"("userCompanyId", "code");

-- CreateIndex
CREATE INDEX "SavedGrant_userId_idx" ON "SavedGrant"("userId");

-- CreateIndex
CREATE INDEX "SavedGrant_grantSource_idx" ON "SavedGrant"("grantSource");

-- CreateIndex
CREATE UNIQUE INDEX "SavedGrant_userId_grantSource_externalId_key" ON "SavedGrant"("userId", "grantSource", "externalId");

-- CreateIndex
CREATE INDEX "SearchHistory_userId_idx" ON "SearchHistory"("userId");

-- CreateIndex
CREATE INDEX "SearchHistory_createdAt_idx" ON "SearchHistory"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SicCodeReference_code_key" ON "SicCodeReference"("code");

-- CreateIndex
CREATE INDEX "SicCodeReference_section_idx" ON "SicCodeReference"("section");

-- CreateIndex
CREATE INDEX "SicCodeReference_division_idx" ON "SicCodeReference"("division");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySicCode" ADD CONSTRAINT "CompanySicCode_userCompanyId_fkey" FOREIGN KEY ("userCompanyId") REFERENCES "UserCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedGrant" ADD CONSTRAINT "SavedGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
