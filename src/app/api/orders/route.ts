import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders, updateOrderStatus, markCashCollected } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, email, phone, address, city, notes, items, subtotal, shipping, total } = body;

    // Validation
    if (!customerName || !email || !phone || !address || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderItems = items.map((item: any) => ({
      productId: item.id,
      productName: item.name,
      variantId: item.variantId || null,
      variantSize: item.variantSize || null,
      unitPrice: Number(item.price),
      qty: Number(item.quantity),
      total: Number(item.price) * Number(item.quantity)
    }));

    const order = await createOrder({
      customerName,
      email,
      phone,
      address,
      city,
      notes,
      subtotal: Number(subtotal),
      discount: Number(body.discount || 0),
      shipping: Number(shipping),
      total: Number(total),
      items: orderItems
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      message: "Order placed successfully!"
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, note, cashCollected } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    let updatedOrder = null;

    if (status) {
      updatedOrder = await updateOrderStatus(orderId, status, note, "Admin");
    }

    if (cashCollected !== undefined) {
      updatedOrder = await markCashCollected(orderId, cashCollected);
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order updated successfully!"
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
