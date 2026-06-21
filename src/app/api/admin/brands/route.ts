import { NextRequest, NextResponse } from "next/server";
import { getBrands, createBrand } from "@/lib/db";

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const brand = await createBrand(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
