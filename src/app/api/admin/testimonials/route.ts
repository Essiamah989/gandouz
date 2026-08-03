import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des témoignages" }, { status: 500 });
  }
}

// POST - create a new testimonial
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, role, content, rating, avatarUrl, isVisible } = body;

    if (!author || !content) {
      return NextResponse.json({ error: "L'auteur et le contenu sont obligatoires" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        author,
        role: role || null,
        content,
        rating: Number(rating) || 5,
        avatarUrl: avatarUrl || null,
        isVisible: isVisible !== false,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Erreur lors de la création du témoignage" }, { status: 500 });
  }
}

// PATCH - update a testimonial
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obligatoire" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(data.author !== undefined && { author: data.author }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.rating !== undefined && { rating: Number(data.rating) }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du témoignage" }, { status: 500 });
  }
}

// DELETE - delete a testimonial
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obligatoire" }, { status: 400 });
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression du témoignage" }, { status: 500 });
  }
}
