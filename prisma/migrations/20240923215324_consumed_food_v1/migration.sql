-- CreateTable
CREATE TABLE "ConsumedFood" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ConsumedFood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "consumedFoodId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "calories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsumedFood_userId_date_idx" ON "ConsumedFood"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumedFood_userId_date_key" ON "ConsumedFood"("userId", "date");

-- AddForeignKey
ALTER TABLE "ConsumedFood" ADD CONSTRAINT "ConsumedFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_consumedFoodId_fkey" FOREIGN KEY ("consumedFoodId") REFERENCES "ConsumedFood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
