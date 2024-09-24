import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.json();

  try {
    // Save the form data to the database
    const user = await prisma.user.create({
      data: {
        id: "1",
        email: "test@test.com",
        mainGoal: formData.mainGoal,
        sex: formData.sex,
        // additionalGoals: formData.additionalGoals,
        countedCalories: formData.countedCalories === "Yes", // Convert to boolean
        birthday: formData.birthday,
        height: parseInt(formData.height),
        activityLevel: formData.activityLevel,
        currentWeight: parseInt(formData.currentWeight),
        goalWeight: parseInt(formData.goalWeight),
        diet: formData.diet,
        measurementSystem: formData.heightUnit === "cm" ? "Metric" : "Imperial",
        // You can add other fields like theme here if needed
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}