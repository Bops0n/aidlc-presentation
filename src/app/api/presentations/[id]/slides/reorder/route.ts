import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError, withErrorHandler } from "@/lib/errors";
import { z } from "zod";

const reorderSchema = z.object({
  slideIds: z.array(z.string()).min(1),
});

async function patchHandler(
  request: Request,
  { params }: { params: { id: string } }
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
  const validation = reorderSchema.safeParse(body);
  if (!validation.success) {
    throw AppError.validation("Validation failed", {
      errors: validation.error.flatten().fieldErrors,
    });
  }

  // Update each slide's order in a transaction
  const updates = validation.data.slideIds.map((slideId, index) =>
    prisma.slide.update({
      where: { id: slideId },
      data: { order: index },
    })
  );

  const slides = await prisma.$transaction(updates);

  return NextResponse.json({ data: slides });
}

export const PATCH = withErrorHandler(patchHandler);
