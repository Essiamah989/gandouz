import { NextRequest, NextResponse } from "next/server";
import { getDiscountCodes, createDiscountCode } from "@/lib/db";

export async function GET() {
  try {
    const codes = await getDiscountCodes();
    return NextResponse.json(codes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = await createDiscountCode(body);
    return NextResponse.json(code, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
