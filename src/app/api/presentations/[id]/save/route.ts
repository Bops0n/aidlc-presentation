import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError, withErrorHandler } from "@/lib/errors";

/**
 * PUT /api/presentations/[id]/save
 * Bulk save all slides — handles create (new slides), update (existing), and delete (removed).
 * This is the auto-save endpoint used by the editor.
 */
async function putHandler(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized();
  const userId = (session.user as any).userId as number;

  // Verify ownership
  const presentation = await prisma.presentation.findFirst({
    where: { id: params.id, owner_id: userId, is_deleted: false },
    include: { slides: { select: { id: true } } },
  });
  if (!presentation) throw AppError.notFound("Presentation not found");

  const body = await request.json();
  const slidesData: Array<{
    id: string;
    order: number;
    background_type: string;
    background_value: string;
    transition_mode: string;
    notes: string;
    elements: any;
  }> = body.slides || [];

  // Existing slide IDs in DB
  const existingIds = new Set(presentation.slides.map((s) => s.id));
  // Incoming slide IDs from client
  const incomingIds = new Set(slidesData.map((s) => s.id));

  // Delete slides that were removed on client
  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toDelete.length > 0) {
    await prisma.slide.deleteMany({
      where: { id: { in: toDelete }, presentation_id: params.id },
    });
  }

  // Upsert each slide (create if new, update if existing)
  for (let i = 0; i < slidesData.length; i++) {
    const s = slidesData[i];
    await prisma.slide.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        presentation_id: params.id,
        order: i,
        background_type: s.background_type || "color",
        background_value: s.background_value || "#ffffff",
        transition_mode: s.transition_mode || "none",
        notes: s.notes || "",
        elements: s.elements || [],
      },
      update: {
        order: i,
        background_type: s.background_type || "color",
        background_value: s.background_value || "#ffffff",
        transition_mode: s.transition_mode || "none",
        notes: s.notes || "",
        elements: s.elements || [],
      },
    });
  }

  return NextResponse.json({ data: { saved: slidesData.length } });
}

export const PUT = withErrorHandler(putHandler);
