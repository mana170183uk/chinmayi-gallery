import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(submissions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const submission = await prisma.contactSubmission.create({
    data: {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
    },
  });
  return NextResponse.json(submission, { status: 201 });
}
