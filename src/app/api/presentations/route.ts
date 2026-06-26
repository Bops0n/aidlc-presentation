import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPresentationSchema, paginationSchema } from "@/lib/validations/presentations";
import { AppError, withErrorHandler } from "@/lib/errors";

// Helper to serialize BigInt fields to Number for JSON
function serializeBigInt(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}

// GET /api/presentations — List user's presentations
async function getHandler(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw AppError.unauthorized();
  }

  const userId = (session.user as any).userId as number;
  const { searchParams } = new URL(request.url);

  const params = paginationSchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    sort: searchParams.get("sort"),
  });

  const sortField = params.sort || "updated_at";
  const skip = (params.page - 1) * params.limit;

  const [presentations, total] = await Promise.all([
    prisma.presentation.findMany({
      where: { owner_id: userId, is_deleted: false },
      orderBy: { [sortField]: "desc" },
      skip,
      take: params.limit,
      include: {
        slides: {
          orderBy: { order: "asc" },
          take: 1,
          select: { id: true },
        },
      },
    }),
    prisma.presentation.count({
      where: { owner_id: userId, is_deleted: false },
    }),
  ]);

  return NextResponse.json({
    data: serializeBigInt(presentations),
    meta: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    },
  });
}

// POST /api/presentations — Create new presentation
async function postHandler(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw AppError.unauthorized();
  }

  const userId = (session.user as any).userId as number;
  const body = await request.json();

  const validation = createPresentationSchema.safeParse(body);
  if (!validation.success) {
    throw AppError.validation("Validation failed", {
      errors: validation.error.flatten().fieldErrors,
    });
  }

  const presentation = await prisma.presentation.create({
    data: {
      title: validation.data.title,
      owner_id: userId,
      slides: {
        create: [
          {
            order: 0,
            background_type: "color",
            background_value: "#ffffff",
            transition_mode: "none",
            elements: [],
          },
        ],
      },
    },
    include: { slides: true },
  });

  return NextResponse.json({ data: serializeBigInt(presentation) }, { status: 201 });
}

export const GET = withErrorHandler(getHandler);
export const POST = withErrorHandler(postHandler);
