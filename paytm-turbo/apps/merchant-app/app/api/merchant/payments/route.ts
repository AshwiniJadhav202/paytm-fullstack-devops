import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import db from "@repo/db/client";

export async function GET() {
  try {
    // Get logged-in merchant
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    // Find merchant using Google email
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

    // Find all payments received by this merchant
    const payments = await db.merchantTransaction.findMany({
      where: {
        merchantId: merchant.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            number: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      merchant: {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        balance: merchant.balance,
      },
      payments,
    });
  } catch (error) {
    console.error("Merchant payments error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}