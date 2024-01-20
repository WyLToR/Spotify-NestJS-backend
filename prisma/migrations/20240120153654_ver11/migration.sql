/*
  Warnings:

  - The primary key for the `PlayLists` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PlayLists" DROP CONSTRAINT "PlayLists_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PlayLists_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PlayLists_id_seq";
