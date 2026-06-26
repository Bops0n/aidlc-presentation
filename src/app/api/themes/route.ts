import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandler } from "@/lib/errors";

async function getHandler() {
  const themes = await prisma.theme.findMany();
  return NextResponse.json({ data: themes });
}

export const GET = withErrorHandler(getHandler);
