import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, description, image, ingredients, steps, status } = body

    const recipe = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        title,
        description,
        image,
        ingredients,
        steps,
        status,
      },
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status } = body

    const recipe = await prisma.recipe.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error updating recipe status:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.recipe.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}