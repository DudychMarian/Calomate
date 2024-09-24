-- CreateEnum
CREATE TYPE "MeasurementSystem" AS ENUM ('Metric', 'Imperial');

-- CreateEnum
CREATE TYPE "Diet" AS ENUM ('Classic', 'Pescatarian', 'Vegetarian', 'Vegan');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('Light active', 'Moderately active', 'Active', 'Very active');

-- CreateEnum
CREATE TYPE "MainGoal" AS ENUM ('Lose weight', 'Maintain weight', 'Gain weight', 'Build muscle', 'Something else');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('Dark', 'Light', 'System');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "sex" "Sex" NOT NULL,
    "activityLevel" "ActivityLevel" NOT NULL,
    "mainGoal" "MainGoal" NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "countedCalories" BOOLEAN NOT NULL DEFAULT false,
    "currentWeight" INTEGER NOT NULL,
    "goalWeight" INTEGER NOT NULL,
    "diet" "Diet" NOT NULL,
    "height" INTEGER NOT NULL,
    "measurementSystem" "MeasurementSystem" NOT NULL,
    "theme" "Theme" DEFAULT 'System',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
