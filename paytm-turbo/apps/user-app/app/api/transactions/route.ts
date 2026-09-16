import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import db from "@repo/db/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    /* -------------------------------- */
    /* USER TO USER TRANSACTIONS        */
    /* -------------------------------- */

    const userTransactions =
      await db.transaction.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              number: true,
              name: true,
            },
          },

          receiver: {
            select: {
              id: true,
              number: true,
              name: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });


    /* -------------------------------- */
    /* MERCHANT PAYMENTS                */
    /* -------------------------------- */

    const merchantPayments =
      await db.merchantTransaction.findMany({
        where: {
          userId: userId,
        },

        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });


    /* -------------------------------- */
    /* FORMAT USER TRANSACTIONS         */
    /* -------------------------------- */

    const formattedUserTransactions =
      userTransactions.map(
        (transaction) => {

          const isSent =
            transaction.senderId === userId;

          return {
            id: transaction.id,

            type: isSent
              ? "sent"
              : "received",

            amount:
              transaction.amount,

            createdAt:
              transaction.createdAt,

            user: isSent
              ? {
                  id:
                    transaction.receiver.id,

                  number:
                    transaction.receiver.number,

                  name:
                    transaction.receiver.name,
                }
              : {
                  id:
                    transaction.sender.id,

                  number:
                    transaction.sender.number,

                  name:
                    transaction.sender.name,
                },

            merchant: null,
          };
        }
      );


    /* -------------------------------- */
    /* FORMAT MERCHANT PAYMENTS         */
    /* -------------------------------- */

    const formattedMerchantPayments =
      merchantPayments.map(
        (payment) => {

          return {
            id:
              `merchant-${payment.id}`,

            type:
              "merchant",

            amount:
              payment.amount,

            createdAt:
              payment.createdAt,

            user: null,

            merchant: {
              id:
                payment.merchant.id,

              name:
                payment.merchant.name,

              email:
                payment.merchant.email,
            },
          };
        }
      );


    /* -------------------------------- */
    /* COMBINE BOTH TYPES               */
    /* -------------------------------- */

    const allTransactions = [
      ...formattedUserTransactions,
      ...formattedMerchantPayments,
    ];


    /* -------------------------------- */
    /* SORT BY DATE                     */
    /* -------------------------------- */

    allTransactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );


    return NextResponse.json({
      transactions:
        allTransactions,
    });

  } catch (error) {

    console.error(
      "Transactions error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}