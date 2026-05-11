/*
  Warnings:

  - Added the required column `name` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Made the column `albumId` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "albumId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
