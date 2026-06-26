import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations/auth";
import { AppError, withErrorHandler } from "@/lib/errors";

async function handler(request: Request) {
  const body = await request.json();

  const validation = signupSchema.safeParse(body);
  if (!validation.success) {
    throw AppError.validation("Validation failed", {
      errors: validation.error.flatten().fieldErrors,
    });
  }

  const { email, password, displayName } = validation.data;

  // Check if email already exists
  const existing = await prisma.user.findFirst({
    where: { email, is_delete: false },
  });

  if (existing) {
    throw AppError.emailExists();
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      hash_password: hashedPassword,
      display_name: displayName || email.split("@")[0],
      firsttime_login_date: new Date(),
      last_login_date: new Date(),
      provider: "credentials",
      confirm_email: false,
      is_delete: false,
    },
  });

  return NextResponse.json(
    { data: { userId: Number(user.user_id), email: user.email } },
    { status: 201 }
  );
}

export const POST = withErrorHandler(handler);
