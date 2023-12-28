-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpires" TIMESTAMP(3);
