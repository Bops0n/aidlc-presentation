import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSlides } from "@/lib/slide-generator";
import { AppError, withErrorHandler } from "@/lib/errors";

async function postHandler(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized();

  const { prompt } = await request.json();
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    throw AppError.validation("Prompt must be at least 3 characters");
  }

  try {
    const result = await generateSlides(prompt.trim());
    return NextResponse.json({ data: result });
  } catch (error: any) {
    console.error("AI generation error:", error);
    throw AppError.internal(error.message || "Failed to generate slides");
  }
}

export const POST = withErrorHandler(postHandler);
