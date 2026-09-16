import { NextResponse } from "next/server";
import db from "@repo/db/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const number = searchParams.get("number");

    if (!number) {
      return NextResponse.json(
        { message: "Mobile number is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        number: number,
      },
      select: {
        id: true,
        name: true,
        number: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });

  } catch (error) {
    console.error(
      "User search error:",
      error
    );

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}