import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError, withErrorHandler } from "@/lib/errors";
import { z } from "zod";

const addSlideSchema = z.object({
  order: z.number().int().min(0),
  background_type: z.string().default("color"),
  background_value: z.string().default("#ffffff"),
});

async function postHandler(
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
  const validation = addSlideSchema.safeParse(body);
  if (!validation.success) {
    throw AppError.validation("Validation failed", {
      errors: validation.error.flatten().fieldErrors,
    });
  }

  const slide = await prisma.slide.create({
    data: {
      presentation_id: params.id,
      order: validation.data.order,
      background_type: validation.data.background_type,
      background_value: validation.data.background_value,
      elements: [],
    },
  });

  return NextResponse.json({ data: slide }, { status: 201 });
}

export const POST = withErrorHandler(postHandler);
