-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "picturePath" TEXT,
ADD COLUMN     "pictureUrl" TEXT;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "picturePath" TEXT,
ADD COLUMN     "pictureUrl" TEXT;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "picturePath" TEXT,
ADD COLUMN     "pictureUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picturePath" TEXT,
ADD COLUMN     "pictureUrl" TEXT;
