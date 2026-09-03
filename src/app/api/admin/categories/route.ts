import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory, updateCategory } from "@/lib/db";

export async function GET() {
  try {
    const cats = await getCategories();
    return NextResponse.json(cats);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cat = await createCategory(body);
    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }
    const cat = await updateCategory(id, data);
    return NextResponse.json(cat);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
