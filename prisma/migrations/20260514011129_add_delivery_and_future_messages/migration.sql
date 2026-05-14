-- CreateTable
CREATE TABLE "capsule_deliveries" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "relationCustom" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capsule_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "future_messages" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "type" "MemoryType" NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "unlocksAt" TIMESTAMP(3) NOT NULL,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "future_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "capsule_deliveries_token_key" ON "capsule_deliveries"("token");

-- AddForeignKey
ALTER TABLE "capsule_deliveries" ADD CONSTRAINT "capsule_deliveries_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "capsules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "future_messages" ADD CONSTRAINT "future_messages_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "capsules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
