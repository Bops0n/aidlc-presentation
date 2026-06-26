import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError, withErrorHandler } from "@/lib/errors";
import { z } from "zod";

const updateSlideSchema = z.object({
  elements: z.any().optional(),
  background_type: z.string().optional(),
  background_value: z.string().optional(),
  transition_mode: z.string().optional(),
  notes: z.string().nullable().optional(),
});

async function patchHandler(
  request: Request,
  { params }: { params: { id: string; slideId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized();
  const userId = (session.user as any).userId as number;

  // Verify ownership
  const presentation = await prisma.presentation.findFirst({
    where: { id: params.id, owner_id: userId, is_deleted: false },
  });
  if (!presentation) throw AppError.notFound("Presentation not found");

  const body = await request.json();
  const validation = updateSlideSchema.safeParse(body);
  if (!validation.success) {
    throw AppError.validation("Validation failed", {
      errors: validation.error.flatten().fieldErrors,
    });
  }

  const slide = await prisma.slide.update({
    where: { id: params.slideId },
    data: validation.data,
  });

  return NextResponse.json({ data: slide });
}

async function deleteHandler(
  request: Request,
  { params }: { params: { id: string; slideId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized();
  const userId = (session.user as any).userId as number;

  // Verify ownership
  const presentation = await prisma.presentation.findFirst({
    where: { id: params.id, owner_id: userId, is_deleted: false },
  });
  if (!presentation) throw AppError.notFound("Presentation not found");

  await prisma.slide.delete({ where: { id: params.slideId } });

  return NextResponse.json({ data: { id: params.slideId, deleted: true } });
}

export const PATCH = withErrorHandler(patchHandler);
export const DELETE = withErrorHandler(deleteHandler);
