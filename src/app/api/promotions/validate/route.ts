import { NextRequest, NextResponse } from "next/server";
import { getDiscountCodeByCode } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const discountCode = await getDiscountCodeByCode(code);

    if (!discountCode) {
      return NextResponse.json({ error: "Invalid promotion code" }, { status: 404 });
    }

    if (!discountCode.isActive) {
      return NextResponse.json({ error: "This promotion code is no longer active" }, { status: 400 });
    }

    if (discountCode.expiresAt && new Date(discountCode.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This promotion code has expired" }, { status: 400 });
    }

    if (discountCode.maxUses !== null && discountCode.maxUses !== undefined && discountCode.usedCount >= discountCode.maxUses) {
      return NextResponse.json({ error: "This promotion code has reached its maximum usage limit" }, { status: 400 });
    }

    const minVal = discountCode.minOrderValue ? Number(discountCode.minOrderValue) : 0;
    if (subtotal < minVal) {
      return NextResponse.json({
        error: `Minimum order value for this code is ${minVal.toFixed(3)} TND`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      code: discountCode.code,
      type: discountCode.type,
      value: Number(discountCode.value)
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
