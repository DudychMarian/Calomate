/*
  Warnings:

  - You are about to drop the column `categoryId` on the `FoodItem` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `FoodItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `FoodItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_consumedFoodId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumedFood" DROP CONSTRAINT "ConsumedFood_userId_fkey";

-- DropForeignKey
ALTER TABLE "FoodItem" DROP CONSTRAINT "FoodItem_categoryId_fkey";

-- DropIndex
DROP INDEX "ConsumedFood_userId_date_idx";

-- DropIndex
DROP INDEX "FoodItem_categoryId_idx";

-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "categoryId",
ADD COLUMN     "category" INTEGER NOT NULL,
ADD COLUMN     "consumedFoodId" TEXT,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "protein" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "fat" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "carbs" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Category";

-- AddForeignKey
ALTER TABLE "ConsumedFood" ADD CONSTRAINT "ConsumedFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_consumedFoodId_fkey" FOREIGN KEY ("consumedFoodId") REFERENCES "ConsumedFood"("id") ON DELETE SET NULL ON UPDATE CASCADE;
