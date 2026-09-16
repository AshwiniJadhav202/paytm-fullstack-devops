import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import db from "@repo/db/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    const body = await req.json();

    const merchantId = Number(body.merchantId);
    const amount = Number(body.amount);

    if (!merchantId) {
      return NextResponse.json(
        { message: "Merchant ID is required" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const merchant = await db.merchant.findUnique({
      where: {
        id: merchantId,
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { message: "Merchant not found" },
        { status: 404 }
      );
    }

    if (user.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    await db.$transaction([
      db.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),

      db.merchant.update({
        where: {
          id: merchant.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),

      db.merchantTransaction.create({
        data: {
          userId: user.id,
          merchantId: merchant.id,
          amount: amount,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Payment successful",
      amount: amount,
      merchant: {
        id: merchant.id,
        name: merchant.name,
      },
    });
  } catch (error) {
    console.error("Merchant payment error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}