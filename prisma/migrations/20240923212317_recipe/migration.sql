/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConsumedFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('Draft', 'Published');

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_consumedFoodId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumedFood" DROP CONSTRAINT "ConsumedFood_userId_fkey";

-- DropForeignKey
ALTER TABLE "FoodItem" DROP CONSTRAINT "FoodItem_categoryId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "ConsumedFood";

-- DropTable
DROP TABLE "FoodItem";

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "ingredients" TEXT[],
    "steps" TEXT[],
    "status" "RecipeStatus" NOT NULL DEFAULT 'Draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
