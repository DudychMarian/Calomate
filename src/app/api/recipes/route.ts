import { prisma } from '@/lib/prisma'; // Ensure the import path is correct
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, ingredients, steps, servings, totalKcal, category, userId } = body;

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        steps,
        servings,
        totalKcal,
        category,
        userId,
      },
    });

    return NextResponse.json({ success: true, recipe: newRecipe });
  } catch (error: any) {
    console.error("Error creating recipe", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, recipes });
  } catch (error) {
    console.error("Error fetching recipes", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, ingredients, steps, servings, totalKcal, category, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Recipe id is required' }, { status: 400 });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        ingredients,
        steps,
        servings,
        totalKcal,
        category,
        status,
      },
    });

    return NextResponse.json({ success: true, recipe: updatedRecipe });
  } catch (error: any) {
    console.error("Error updating recipe", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Recipe id is required' }, { status: 400 });
    }

    const deletedRecipe = await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedRecipe });
  } catch (error: any) {
    console.error("Error deleting recipe", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}