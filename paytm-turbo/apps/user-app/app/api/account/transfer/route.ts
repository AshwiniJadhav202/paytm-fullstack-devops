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

    const senderId = Number(session.user.id);

    const body = await req.json();

    const recipient = body.recipient;
    const amount = Number(body.amount);

    // Check recipient and amount
    if (!recipient || !amount) {
      return NextResponse.json(
        { message: "Recipient and amount are required" },
        { status: 400 }
      );
    }

    // Check amount
    if (amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    // Find sender
    const sender = await db.user.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      return NextResponse.json(
        { message: "Sender not found" },
        { status: 404 }
      );
    }

    // Find receiver by mobile number
    const receiver = await db.user.findUnique({
      where: {
        number: recipient,
      },
    });

    // Recipient does not have a PayTM account
    if (!receiver) {
      return NextResponse.json(
        {
          message:
            "This mobile number is not registered with PayTM. Ask the recipient to create an account first.",
          code: "RECIPIENT_NOT_REGISTERED",
        },
        { status: 404 }
      );
    }

    // Cannot transfer to yourself
    if (sender.id === receiver.id) {
      return NextResponse.json(
        {
          message: "You cannot transfer money to yourself",
        },
        { status: 400 }
      );
    }

    // Check balance
    if (sender.balance < amount) {
      return NextResponse.json(
        {
          message: "Insufficient balance",
        },
        { status: 400 }
      );
    }

    // Transfer money + create transaction
    await db.$transaction([
      db.user.update({
        where: {
          id: sender.id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),

      db.user.update({
        where: {
          id: receiver.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),

      db.transaction.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          amount: amount,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Transfer successful",
    });
  } catch (error) {
    console.error("Transfer error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}