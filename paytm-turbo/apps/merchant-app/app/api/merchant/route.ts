import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import db from "@repo/db/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    const merchant = await db.merchant.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { message: "Merchant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      merchant: {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        balance: merchant.balance,
      },
    });
  } catch (error) {
    console.error("Merchant API error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}