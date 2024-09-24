/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FoodItem" DROP CONSTRAINT "FoodItem_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FoodItem" ALTER COLUMN "categoryId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Category_consumedFoodId_category_idx" ON "Category"("consumedFoodId", "category");

-- CreateIndex
CREATE INDEX "FoodItem_categoryId_idx" ON "FoodItem"("categoryId");

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
