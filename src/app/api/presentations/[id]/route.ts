import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePresentationSchema } from "@/lib/validations/presentations";
import { AppError, withErrorHandler } from "@/lib/errors";

// Helper to serialize BigInt fields to Number for JSON
function serializeBigInt(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}

// GET /api/presentations/[id]
async function getHandler(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw AppError.unauthorized();
  }

  const userId = (session.user as any).userId as number;

  const presentation = await prisma.presentation.findFirst({
    where: { id: params.id, owner_id: userId, is_deleted: false },
    include: {
      slides: { orderBy: { order: "asc" } },
    },
  });

  if (!presentation) {
    throw AppError.notFound("Presentation not found");
  }

  return NextResponse.json({ data: serializeBigInt(presentation) });
}

// PATCH /api/presentations/[id]
async function patchHandler(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw AppError.unauthorized();
  }

  const userId = (session.user as any).userId as number;
  const body = await request.json();

  const validation = updatePresentationSchema.safeParse(body);
  if (!validation.success) {
    throw AppError.validation("Validation failed", {
      errors: validation.error.flatten().fieldErrors,
    });
  }

  // Check ownership
  const existing = await prisma.presentation.findFirst({
    where: { id: params.id, owner_id: userId, is_deleted: false },
  });

  if (!existing) {
    throw AppError.notFound("Presentation not found");
  }

  const updated = await prisma.presentation.update({
    where: { id: params.id },
    data: validation.data,
  });

  return NextResponse.json({ data: serializeBigInt(updated) });
}

// DELETE /api/presentations/[id] (soft delete)
async function deleteHandler(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw AppError.unauthorized();
  }

  const userId = (session.user as any).userId as number;

  const existing = await prisma.presentation.findFirst({
    where: { id: params.id, owner_id: userId, is_deleted: false },
  });

  if (!existing) {
    throw AppError.notFound("Presentation not found");
  }

  await prisma.presentation.update({
    where: { id: params.id },
    data: { is_deleted: true },
  });

  return NextResponse.json({ data: { id: params.id, deleted: true } });
}

export const GET = withErrorHandler(getHandler);
export const PATCH = withErrorHandler(patchHandler);
export const DELETE = withErrorHandler(deleteHandler);
