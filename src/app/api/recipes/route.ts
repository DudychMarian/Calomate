import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany()
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, image, ingredients, steps, status } = body

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        image,
        ingredients,
        steps,
        status,
      },
    })

    return NextResponse.json({ success: true, recipe})
  } catch (error: any) {
    console.error('Error creating recipe:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}