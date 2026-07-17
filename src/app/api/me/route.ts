import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateUserFromClerk } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await getCurrentUser();
    if (!clerkUser) {
      return NextResponse.json({ user: null });
    }

    const dbUser = await getOrCreateUserFromClerk(clerkUser);
    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("Error in api/me:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
