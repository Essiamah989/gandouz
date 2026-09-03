import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;
const BUCKET = "product-images";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try Supabase upload if configured
    if (supabaseAdmin) {
      try {
        const filePath = `products/${uniqueName}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (!uploadError) {
          const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
          return NextResponse.json({ url: data.publicUrl });
        }
        console.warn("Supabase upload error, falling back to local storage:", uploadError.message);
      } catch (err) {
        console.warn("Supabase upload failed, falling back to local storage:", err);
      }
    }

    // Local filesystem fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const localFilePath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(localFilePath, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}` });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
