"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

type TransactionUser = {
  id: number;
  number: string;
  name: string | null;
};

type Merchant = {
  id: number;
  name: string | null;
  email: string;
};

type Transaction = {
  id: number | string;
  type: "sent" | "received" | "merchant";
  amount: number;
  createdAt: string;
  user: TransactionUser | null;
  merchant: Merchant | null;
};

export default function TransactionDetailsPage() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const params = useParams();

  const transactionId = params.id;

  const [transaction, setTransaction] =
    useState<Transaction | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* -------------------------------- */
  /* CHECK LOGIN                      */
  /* -------------------------------- */

  useEffect(() => {

    if (status === "unauthenticated") {
      router.push("/signin");
    }

  }, [status, router]);


  /* -------------------------------- */
  /* LOAD TRANSACTION                 */
  /* -------------------------------- */

  useEffect(() => {

    if (status !== "authenticated") return;


    const loadTransaction = async () => {

      try {

        const response =
          await fetch("/api/transactions");


        if (!response.ok) {

          setError(
            "Unable to load transactions"
          );

          return;
        }


        const data =
          await response.json();


        const foundTransaction =
          data.transactions.find(
            (item: Transaction) =>
              item.id.toString() ===
              transactionId
          );


        if (!foundTransaction) {

          setError(
            "Transaction not found"
          );

          return;
        }


        setTransaction(
          foundTransaction
        );


      } catch (error) {

        console.error(
          "Transaction details error:",
          error
        );

        setError(
          "Something went wrong"
        );

      } finally {

        setLoading(false);

      }

    };


    loadTransaction();

  }, [
    status,
    transactionId
  ]);


  /* -------------------------------- */
  /* LOADING                          */
  /* -------------------------------- */

  if (
    status === "loading" ||
    loading
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <p className="text-gray-500">
          Loading transaction details...
        </p>

      </div>

    );

  }


  if (!session) {
    return null;
  }


  /* -------------------------------- */
  /* ERROR                            */
  /* -------------------------------- */

  if (
    error ||
    !transaction
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

          <p className="text-red-600">
            {error || "Transaction not found"}
          </p>


          <button
            onClick={() =>
              router.push("/transactions")
            }
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Transactions
          </button>

        </div>

      </div>

    );

  }


  /* -------------------------------- */
  /* TRANSACTION TYPE                 */
  /* -------------------------------- */

  const isSent =
    transaction.type === "sent";

  const isMerchant =
    transaction.type === "merchant";


  /* -------------------------------- */
  /* PERSON / MERCHANT                */
  /* -------------------------------- */

  const personName =
    isMerchant
      ? transaction.merchant?.name ||
        "Merchant"
      : transaction.user?.name ||
        "User";


  const personContact =
    isMerchant
      ? transaction.merchant?.email ||
        "Merchant"
      : transaction.user?.number ||
        "Unknown number";


  const personInitial =
    personName
      .charAt(0)
      .toUpperCase();


  /* -------------------------------- */
  /* DATE / TIME                      */
  /* -------------------------------- */

  const transactionDate =
    new Date(
      transaction.createdAt
    );


  const date =
    transactionDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );


  const time =
    transactionDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );


  /* -------------------------------- */
  /* USER INFORMATION                 */
  /* -------------------------------- */

  const userName =
    session.user?.name ||
    "User";


  const userEmail =
    session.user?.email ||
    "";


  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();


  return (

    <div className="min-h-screen bg-gray-50">


      {/* -------------------------------- */}
      {/* HEADER                           */}
      {/* -------------------------------- */}

      <header className="fixed left-0 right-0 top-0 z-50 h-[72px] border-b border-gray-200 bg-white">

        <div className="flex h-full items-center justify-between px-8">


          {/* LOGO */}

          <button
            onClick={() =>
              router.push("/")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              P
            </div>


            <div className="text-left">

              <h1 className="text-xl font-bold text-gray-900">
                PayTM
              </h1>

              <p className="text-xs text-gray-500">
                User
              </p>

            </div>

          </button>


          {/* USER */}

          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="text-sm font-semibold text-gray-900">
                {userName}
              </p>

              <p className="text-xs text-gray-500">
                {userEmail}
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

              {userInitial}

            </div>

          </div>

        </div>

      </header>


      {/* -------------------------------- */}
      {/* SIDEBAR                          */}
      {/* -------------------------------- */}

      <aside className="fixed bottom-0 left-0 top-[72px] w-[230px] border-r border-gray-200 bg-white">

        <div className="p-5">


          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Menu
          </p>


          <nav className="space-y-2">


            {/* HOME */}

            <button
              onClick={() =>
                router.push("/")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >

              <span>⌂</span>

              Home

            </button>


            {/* EXPLORE */}

            <button
              onClick={() =>
                router.push("/explore")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >

              <span>⌕</span>

              Explore

            </button>


            {/* REWARDS */}

            <button
              onClick={() =>
                router.push("/rewards")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >

              <span>%</span>

              Rewards

            </button>


            {/* TRANSFER */}

            <button
              onClick={() =>
                router.push("/transfer")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >

              <span>⇄</span>

              Transfer

            </button>


            {/* TRANSACTIONS */}

            <button
              onClick={() =>
                router.push("/transactions")
              }
              className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
            >

              <span>◷</span>

              Transactions

            </button>


            {/* ACCOUNT */}

            <button
              onClick={() =>
                router.push("/account")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >

              <span>⚙</span>

              Account

            </button>

          </nav>

        </div>

      </aside>


      {/* -------------------------------- */}
      {/* MAIN                             */}
      {/* -------------------------------- */}

      <main className="ml-[230px] pt-[72px]">

        <div className="mx-auto max-w-4xl px-8 py-10">


          {/* BACK BUTTON */}

          <button
            onClick={() =>
              router.push("/transactions")
            }
            className="mb-6 text-sm font-medium text-gray-600 hover:text-black"
          >

            ← Back to Transactions

          </button>


          {/* PAGE HEADER */}

          <div className="mb-8">

            <p className="text-sm font-medium text-blue-600">

              {isMerchant
                ? "Merchant Payment"
                : "Transaction"}

            </p>


            <h2 className="mt-1 text-3xl font-bold text-gray-900">

              Transaction Details

            </h2>


            <p className="mt-2 text-sm text-gray-500">

              Complete information about this transaction.

            </p>

          </div>


          {/* -------------------------------- */}
          {/* SUCCESS CARD                     */}
          {/* -------------------------------- */}

          <div
            className={`mb-6 rounded-2xl border p-6 ${
              isMerchant
                ? "border-purple-200 bg-purple-50"
                : isSent
                ? "border-red-200 bg-red-50"
                : "border-green-200 bg-green-50"
            }`}
          >

            <div className="flex items-center gap-4">


              {/* ICON */}

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                  isMerchant
                    ? "bg-purple-100 text-purple-600"
                    : isSent
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >

                {isMerchant
                  ? "₹"
                  : isSent
                  ? "↑"
                  : "↓"}

              </div>


              {/* MESSAGE */}

              <div>

                <p
                  className={`font-semibold ${
                    isMerchant
                      ? "text-purple-700"
                      : isSent
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >

                  {isMerchant
                    ? "Payment Successful"
                    : isSent
                    ? "Money Sent Successfully"
                    : "Money Received Successfully"}

                </p>


                <p
                  className={`text-sm ${
                    isMerchant
                      ? "text-purple-600"
                      : isSent
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >

                  Your transaction was completed successfully.

                </p>

              </div>

            </div>

          </div>


          {/* -------------------------------- */}
          {/* AMOUNT CARD                      */}
          {/* -------------------------------- */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">


            <p className="text-sm text-gray-500">
              Transaction Amount
            </p>


            <p
              className={`mt-2 text-4xl font-bold ${
                isMerchant
                  ? "text-purple-600"
                  : isSent
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >

              {isSent || isMerchant
                ? "-"
                : "+"}

              ₹

              {transaction.amount.toLocaleString(
                "en-IN"
              )}

            </p>


            <p className="mt-2 text-sm text-gray-500">

              {isMerchant
                ? "Amount paid to the merchant"
                : isSent
                ? "Amount deducted from your balance"
                : "Amount added to your balance"}

            </p>

          </div>


          {/* -------------------------------- */}
          {/* PERSON / MERCHANT INFORMATION    */}
          {/* -------------------------------- */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">


            <h3 className="mb-6 text-xl font-semibold text-gray-900">

              {isMerchant
                ? "Merchant Information"
                : isSent
                ? "Recipient Information"
                : "Sender Information"}

            </h3>


            <div className="flex items-center gap-4">


              {/* AVATAR */}

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold ${
                  isMerchant
                    ? "bg-purple-100 text-purple-700"
                    : isSent
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >

                {isMerchant
                  ? "₹"
                  : personInitial}

              </div>


              {/* DETAILS */}

              <div>

                <p className="font-semibold text-gray-900">

                  {personName}

                </p>


                <p className="mt-1 text-sm text-gray-500">

                  {personContact}

                </p>

              </div>

            </div>

          </div>


          {/* -------------------------------- */}
          {/* TRANSACTION INFORMATION          */}
          {/* -------------------------------- */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">


            <h3 className="mb-6 text-xl font-semibold text-gray-900">

              Transaction Information

            </h3>


            <div className="grid gap-6 md:grid-cols-2">


              {/* TRANSACTION ID */}

              <div>

                <p className="text-sm text-gray-500">
                  Transaction ID
                </p>


                <p className="mt-1 font-mono font-medium text-gray-900">

                  #{transaction.id}

                </p>

              </div>


              {/* TYPE */}

              <div>

                <p className="text-sm text-gray-500">
                  Transaction Type
                </p>


                <p className="mt-1 font-medium capitalize text-gray-900">

                  {isMerchant
                    ? "Merchant Payment"
                    : transaction.type}

                </p>

              </div>


              {/* DATE */}

              <div>

                <p className="text-sm text-gray-500">
                  Date
                </p>


                <p className="mt-1 font-medium text-gray-900">

                  {date}

                </p>

              </div>


              {/* TIME */}

              <div>

                <p className="text-sm text-gray-500">
                  Time
                </p>


                <p className="mt-1 font-medium text-gray-900">

                  {time}

                </p>

              </div>


              {/* STATUS */}

              <div>

                <p className="text-sm text-gray-500">
                  Status
                </p>


                <p className="mt-1 font-medium text-green-600">

                  ✓ Successful

                </p>

              </div>


              {/* PAYMENT METHOD */}

              <div>

                <p className="text-sm text-gray-500">
                  Payment Method
                </p>


                <p className="mt-1 font-medium text-gray-900">

                  {isMerchant
                    ? "QR Payment"
                    : "PayTM Wallet"}

                </p>

              </div>


              {/* MERCHANT ID */}

              {isMerchant && (

                <div>

                  <p className="text-sm text-gray-500">
                    Merchant ID
                  </p>


                  <p className="mt-1 font-mono font-medium text-gray-900">

                    #{transaction.merchant?.id}

                  </p>

                </div>

              )}

            </div>

          </div>


          {/* -------------------------------- */}
          {/* ACTIONS                          */}
          {/* -------------------------------- */}

          <div className="flex gap-4">


            <button
              onClick={() =>
                router.push("/transactions")
              }
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >

              ← Back

            </button>


            <button
              onClick={() =>
                router.push("/transfer")
              }
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >

              Send Money

            </button>

          </div>

        </div>

      </main>

    </div>

  );
}