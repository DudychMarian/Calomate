import { prisma } from '@/lib/prisma'; // Ensure the import path is correct
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, date, foodItems } = body;

    const consumedFood = await prisma.consumedFood.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(date).toISOString(), // Ensure the date is formatted correctly
        },
      },
      update: {
        foodItems: {
          create: foodItems.map((item: any) => ({
            name: item.name,
            image: item.image,
            calories: item.calories,
            protein: item.protein,
            fat: item.fat,
            carbs: item.carbs,
            category: item.category,
          })),
        },
      },
      create: {
        userId,
        date: new Date(date),
        foodItems: {
          create: foodItems.map((item: any) => ({
            name: item.name,
            image: item.image,
            calories: item.calories,
            protein: item.protein,
            fat: item.fat,
            carbs: item.carbs,
            category: item.category,
          })),
        },
      },
      include: {
        foodItems: true,
      },
    });

    return NextResponse.json({ success: true, consumedFood });
  } catch (error: any) {
    console.error("Error adding consumed food", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  if (!userId || !date) {
    return NextResponse.json({ success: false, error: 'userId and date are required' }, { status: 400 });
  }

  try {
    const consumedFood = await prisma.consumedFood.findFirst({
      where: {
        userId,
        date: new Date(date).toISOString(), // Ensure the date is formatted correctly
      },
      include: {
        foodItems: true,
      },
    });

    if (!consumedFood) {
      return NextResponse.json({ success: true, consumedFood: null });
    }

    return NextResponse.json({ success: true, consumedFood });
  } catch (error) {
    console.error("Error fetching consumed food", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { foodItemId } = await req.json();

    if (!foodItemId) {
      return NextResponse.json({ success: false, error: 'foodItemId is required' }, { status: 400 });
    }

    const deletedFoodItem = await prisma.foodItem.delete({
      where: { id: foodItemId },
    });

    return NextResponse.json({ success: true, deletedFoodItem });
  } catch (error: any) {
    console.error("Error deleting food item", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}