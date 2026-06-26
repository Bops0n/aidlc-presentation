import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError, withErrorHandler } from "@/lib/errors";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024;

function serializeBigInt(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
}

async function postHandler(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized();
  const userId = (session.user as any).userId as number;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) throw AppError.validation("No file provided");

  if (!ALLOWED.includes(file.type)) {
    throw AppError.validation("Invalid file type. Allowed: JPEG, PNG, WebP, SVG");
  }
  if (file.size > MAX_SIZE) {
    throw AppError.validation("File too large. Max 10MB");
  }

  const ext = file.name.split(".").pop() || "png";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/${filename}`;
  const upload = await prisma.upload.create({
    data: { owner_id: userId, url, filename: file.name, size: file.size, mime_type: file.type },
  });

  return NextResponse.json({ data: serializeBigInt(upload) }, { status: 201 });
}

async function getHandler() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized();
  const userId = (session.user as any).userId as number;

  const uploads = await prisma.upload.findMany({
    where: { owner_id: userId },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ data: serializeBigInt(uploads) });
}

export const POST = withErrorHandler(postHandler);
export const GET = withErrorHandler(getHandler);
