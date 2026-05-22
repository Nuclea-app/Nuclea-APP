-- AlterTable
ALTER TABLE "capsule_deliveries" ADD COLUMN "recipient_user_id" TEXT;

-- AddForeignKey
ALTER TABLE "capsule_deliveries" ADD CONSTRAINT "capsule_deliveries_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
