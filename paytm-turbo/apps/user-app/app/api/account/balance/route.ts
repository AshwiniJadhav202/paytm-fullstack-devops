import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import db from "@repo/db/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        message: "You are not logged in",
      },
      {
        status: 401,
      }
    );
  }

  const userId = Number(session.user.id);

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      balance: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    balance: user.balance,
  });
}