import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET current password hash (for verification only, returns existence)
export async function GET() {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: "admin_password" },
    });
    return NextResponse.json({ hasPassword: !!setting });
  } catch (error) {
    console.error("Error checking password:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - update the admin password
// Body: { currentPassword: string, newPassword: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit contenir au moins 6 caractères." },
        { status: 400 }
      );
    }

    // Get the current stored password
    const setting = await prisma.storeSetting.findUnique({
      where: { key: "admin_password" },
    });

    // If a password is set, verify the current one
    if (setting) {
      if (setting.value !== currentPassword) {
        return NextResponse.json(
          { error: "Le mot de passe actuel est incorrect." },
          { status: 401 }
        );
      }
    }

    // Update or create the admin_password setting
    await prisma.storeSetting.upsert({
      where: { key: "admin_password" },
      update: { value: newPassword },
      create: { key: "admin_password", value: newPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du mot de passe" }, { status: 500 });
  }
}
