/*
  Warnings:

  - You are about to drop the column `picturePath` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "picturePath",
DROP COLUMN "pictureUrl";
