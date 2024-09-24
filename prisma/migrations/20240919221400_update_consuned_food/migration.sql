/*
  Warnings:

  - A unique constraint covering the columns `[consumedFoodId,category]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,date]` on the table `ConsumedFood` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_consumedFoodId_category_key" ON "Category"("consumedFoodId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumedFood_userId_date_key" ON "ConsumedFood"("userId", "date");
