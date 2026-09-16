import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
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

    const today = new Date();

    const todayPayments = payments.filter((payment: { createdAt: string | number | Date; }) => {
      const paymentDate = new Date(payment.createdAt);

      return (
        paymentDate.getDate() === today.getDate() &&
        paymentDate.getMonth() === today.getMonth() &&
        paymentDate.getFullYear() === today.getFullYear()
      );
    });

    const totalReceived = payments.reduce(
      (total: number, payment: { amount: number; }) => total + payment.amount,
      0
    );

    const todayReceived = todayPayments.reduce(
      (total: number, payment: { amount: number; }) => total + payment.amount,
      0
    );

    return NextResponse.json({
      merchant: {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        balance: merchant.balance,
      },

      statistics: {
        totalPayments: payments.length,
        totalReceived,
        todayPayments: todayPayments.length,
        todayReceived,
      },

      recentPayments: payments.slice(0, 5),
    });
  } catch (error) {
    console.error("Merchant dashboard error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}