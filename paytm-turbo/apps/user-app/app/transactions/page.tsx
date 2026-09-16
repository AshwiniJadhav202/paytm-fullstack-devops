"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TransactionUser = {
  id: number;
  name: string | null;
  number: string;
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

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/transactions", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/signin");
          return;
        }

        setError(
          data.message || "Unable to load transactions."
        );

        return;
      }

      if (!Array.isArray(data.transactions)) {
        setError(
          "Invalid transaction data received from server."
        );

        return;
      }

      setTransactions(data.transactions);
    } catch (error) {
      console.error("Transaction fetch error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalSent = transactions
    .filter(
      (transaction) =>
        transaction.type === "sent" ||
        transaction.type === "merchant"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const totalReceived = transactions
    .filter(
      (transaction) =>
        transaction.type === "received"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex items-center justify-between">

            <button
              onClick={() => router.push("/")}
              className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <span className="text-xl transition-transform group-hover:-translate-x-1">
                ←
              </span>

              <span className="text-sm font-medium">
                Back
              </span>
            </button>

            {/* LOGO */}

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">
                  P
                </span>
              </div>

              <span className="font-bold text-blue-600 text-lg">
                PayTM
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* PAGE TITLE */}

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <p className="text-sm font-medium text-blue-600 mb-2">
                Payments
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Transaction History
              </h1>

              <p className="text-gray-500 mt-2">
                View and track all your PayTM transactions.
              </p>

            </div>

            {!loading && !error && transactions.length > 0 && (
              <div className="text-sm text-gray-500">
                {transactions.length} transaction
                {transactions.length !== 1 ? "s" : ""}
              </div>
            )}

          </div>

        </div>


        {/* SUMMARY CARDS */}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

            {/* TOTAL SENT */}

            <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Total Sent
                  </p>

                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    ₹{totalSent.toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Including merchant payments
                  </p>

                </div>

                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition">

                  <span className="text-red-600 text-xl font-bold">
                    ↑
                  </span>

                </div>

              </div>

            </div>


            {/* TOTAL RECEIVED */}

            <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    Total Received
                  </p>

                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    ₹{totalReceived.toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Money received from users
                  </p>

                </div>

                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition">

                  <span className="text-green-600 text-xl font-bold">
                    ↓
                  </span>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* LOADING */}

        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">

            <div className="w-11 h-11 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto">
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mt-5">
              Loading transactions
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please wait while we fetch your payment history.
            </p>

          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-2xl p-8 sm:p-10 text-center shadow-sm">

            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">

              <span className="text-red-600 text-2xl">
                ⚠
              </span>

            </div>

            <h2 className="text-lg font-semibold text-gray-900 mt-5">
              Unable to load transactions
            </h2>

            <p className="text-sm text-red-600 mt-2 max-w-md mx-auto">
              {error}
            </p>

            <button
              onClick={fetchTransactions}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
            >
              Try Again
            </button>

          </div>
        )}


        {/* EMPTY STATE */}

        {!loading &&
          !error &&
          transactions.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 sm:p-14 text-center shadow-sm">

              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">

                <span className="text-blue-600 text-2xl font-bold">
                  ₹
                </span>

              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-5">
                No transactions yet
              </h2>

              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                Your sent, received, and merchant payments
                will appear here once you make a transaction.
              </p>

              <button
                onClick={() => router.push("/")}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
              >
                Go to Dashboard
              </button>

            </div>
          )}


        {/* TRANSACTIONS */}

        {!loading &&
          !error &&
          transactions.length > 0 && (

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

              {/* LIST HEADER */}

              <div className="px-5 sm:px-6 py-5 border-b border-gray-200">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      All Transactions
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Complete payment history
                    </p>

                  </div>

                  <div className="hidden sm:flex w-10 h-10 bg-blue-50 rounded-xl items-center justify-center">

                    <span className="text-blue-600">
                      ↕
                    </span>

                  </div>

                </div>

              </div>


              {/* TRANSACTION LIST */}

              <div>

                {transactions.map(
                  (transaction, index) => {

                    const isSent =
                      transaction.type === "sent";

                    const isMerchant =
                      transaction.type === "merchant";

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

                    const displayAmount =
                      isSent || isMerchant
                        ? `-₹${transaction.amount.toLocaleString(
                            "en-IN"
                          )}`
                        : `+₹${transaction.amount.toLocaleString(
                            "en-IN"
                          )}`;

                    const amountClass =
                      isSent || isMerchant
                        ? "text-red-600"
                        : "text-green-600";

                    const icon =
                      isMerchant
                        ? "₹"
                        : isSent
                        ? "↑"
                        : "↓";

                    const iconBackground =
                      isMerchant
                        ? "bg-purple-50"
                        : isSent
                        ? "bg-red-50"
                        : "bg-green-50";

                    const iconColor =
                      isMerchant
                        ? "text-purple-600"
                        : isSent
                        ? "text-red-600"
                        : "text-green-600";

                    const label =
                      isMerchant
                        ? "Merchant Payment"
                        : isSent
                        ? "Money Sent"
                        : "Money Received";

                    return (
                      <div
                        key={transaction.id}
                        className={`px-5 sm:px-6 py-5 ${
                          index !== transactions.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        } hover:bg-gray-50 transition`}
                      >

                        <div className="flex items-center justify-between gap-4">

                          {/* LEFT SIDE */}

                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                            <div
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBackground}`}
                            >

                              <span
                                className={`font-bold text-lg ${iconColor}`}
                              >
                                {icon}
                              </span>

                            </div>


                            <div className="min-w-0">

                              <p className="font-semibold text-gray-900 truncate">
                                {personName}
                              </p>

                              <p className="text-sm text-gray-500 truncate mt-0.5">
                                {personContact}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 mt-1.5">

                                <span className="text-xs text-gray-400">
                                  {label}
                                </span>

                                <span className="text-xs text-gray-300">
                                  •
                                </span>

                                <span className="text-xs text-gray-400">
                                  {formatDate(
                                    transaction.createdAt
                                  )}
                                </span>

                              </div>

                            </div>

                          </div>


                          {/* RIGHT SIDE */}

                          <div className="text-right flex-shrink-0">

                            <p
                              className={`font-bold text-sm sm:text-base ${amountClass}`}
                            >
                              {displayAmount}
                            </p>

                            <button
                              onClick={() =>
                                router.push(
                                  `/transactions/${transaction.id}`
                                )
                              }
                              className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-semibold transition"
                            >
                              View Details →
                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

      </main>


      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white mt-8">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

          <p className="text-center text-xs text-gray-400">
            Secure payments powered by PayTM
          </p>

        </div>

      </footer>

    </div>
  );
}