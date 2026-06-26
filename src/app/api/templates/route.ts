import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandler } from "@/lib/errors";

async function getHandler() {
  const templates = await prisma.template.findMany({
    orderBy: { category: "asc" },
  });
  return NextResponse.json({ data: templates });
}

export const GET = withErrorHandler(getHandler);
