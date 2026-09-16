"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string | null;
  number: string;
  email: string | null;
  balance: number;
}

interface TransactionUser {
  id: number;
  number: string;
  name: string | null;
}

interface Merchant {
  id: number;
  name: string | null;
  email: string;
}

interface Transaction {
  id: number | string;
  type: "sent" | "received" | "merchant";
  amount: number;
  createdAt: string;
  user: TransactionUser | null;
  merchant: Merchant | null;
}

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");

      if (!response.ok) {
        router.push("/signin");
        return;
      }

      const data = await response.json();

      setUser(data.user);
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Transactions fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import("next-auth/react");

      await signOut({
        callbackUrl: "/signin",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    return "U";
  };

  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }

    return "User";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500 text-sm">
            Loading your PayTM account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 flex items-center justify-between">

            {/* LOGO */}

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 group"
            >

              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition">

                <span className="text-white font-bold text-xl">
                  P
                </span>

              </div>

              <div className="text-left">

                <h1 className="text-xl font-bold text-blue-600 tracking-tight">
                  PayTM
                </h1>

                <p className="text-[10px] text-gray-400 hidden sm:block">
                  Simple. Secure. Fast.
                </p>

              </div>

            </button>


            {/* RIGHT SIDE */}

            <div className="relative">

              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition"
              >

                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">

                  <span className="font-bold text-blue-600">
                    {getInitial()}
                  </span>

                </div>


                <div className="hidden sm:block text-left">

                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user?.number}
                  </p>

                </div>


                <span
                  className={`text-gray-400 text-xs transition-transform ${
                    showMenu ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>

              </button>


              {/* DROPDOWN */}

              {showMenu && (

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">

                  <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">

                        <span className="font-bold text-blue-600">
                          {getInitial()}
                        </span>

                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.name || "User"}
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          {user?.number}
                        </p>

                      </div>

                    </div>

                  </div>


                  <button
                    onClick={() => router.push("/account")}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    👤 My Account
                  </button>


                  <button
                    onClick={() => router.push("/transactions")}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    📋 Transactions
                  </button>


                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition"
                  >
                    ↪ Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </header>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* ================================================= */}
        {/* WELCOME */}
        {/* ================================================= */}

        <section className="mb-8">

          <p className="text-sm font-medium text-blue-600">
            Welcome back
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1 tracking-tight">
            Hello, {getFirstName()} 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your money, payments and transactions easily.
          </p>

        </section>


        {/* ================================================= */}
        {/* BALANCE + QUICK ACTIONS */}
        {/* ================================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">


          {/* BALANCE CARD */}

          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-blue-100 text-sm font-medium">
                  Available Balance
                </p>

                <h2 className="text-4xl sm:text-5xl font-bold mt-3 tracking-tight">

                  ₹
                  {(user?.balance || 0).toLocaleString("en-IN")}

                </h2>

                <p className="text-blue-100 text-xs mt-3">
                  Current wallet balance
                </p>

              </div>


              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">

                <span className="text-2xl font-semibold">
                  ₹
                </span>

              </div>

            </div>


            <div className="mt-8 pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <p className="text-xs text-blue-100">
                  Account number
                </p>

                <p className="text-sm font-medium mt-1">
                  {user?.number}
                </p>

              </div>


              <button
                onClick={() => router.push("/account")}
                className="text-sm bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
              >
                View Account →
              </button>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">

            <h3 className="font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>


            <div className="space-y-3">


              {/* SEND */}

              <button
                onClick={() => router.push("/send")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-transparent hover:border-blue-200 transition text-left group"
              >

                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition">
                  ↑
                </div>

                <div>

                  <p className="font-semibold text-gray-900">
                    Send Money
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Transfer to a user
                  </p>

                </div>

              </button>


              {/* RECEIVE */}

              <button
                onClick={() => router.push("/receive")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-green-50 hover:bg-green-100 border border-transparent hover:border-green-200 transition text-left group"
              >

                <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition">
                  ↓
                </div>

                <div>

                  <p className="font-semibold text-gray-900">
                    Receive Money
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Receive from others
                  </p>

                </div>

              </button>


              {/* TRANSACTIONS */}

              <button
                onClick={() => router.push("/transactions")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-transparent hover:border-purple-200 transition text-left group"
              >

                <div className="w-11 h-11 bg-purple-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition">
                  ₹
                </div>

                <div>

                  <p className="font-semibold text-gray-900">
                    Transactions
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    View payment history
                  </p>

                </div>

              </button>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* RECENT TRANSACTIONS */}
        {/* ================================================= */}

        <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">


          {/* HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-200 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your latest payments and transfers
              </p>

            </div>


            <button
              onClick={() => router.push("/transactions")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              View All →
            </button>

          </div>


          {/* TRANSACTIONS */}

          {transactions.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">

                <span className="text-2xl text-gray-400">
                  ₹
                </span>

              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                No transactions yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your payments and transfers will appear here.
              </p>

              <button
                onClick={() => router.push("/send")}
                className="mt-5 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition shadow-sm"
              >
                Send Money
              </button>

            </div>

          ) : (

            <div>

              {transactions
                .slice(0, 5)
                .map((transaction) => {

                  const isSent =
                    transaction.type === "sent";

                  const isMerchant =
                    transaction.type === "merchant";


                  const personName =
                    isMerchant
                      ? transaction.merchant?.name || "Merchant"
                      : transaction.user?.name ||
                        transaction.user?.number ||
                        "User";


                  const personContact =
                    isMerchant
                      ? transaction.merchant?.email || ""
                      : transaction.user?.number || "";


                  return (

                    <button
                      key={transaction.id}
                      onClick={() =>
                        router.push(
                          `/transactions/${transaction.id}`
                        )
                      }
                      className="w-full flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-slate-50 transition text-left group"
                    >

                      {/* LEFT */}

                      <div className="flex items-center gap-4 min-w-0">


                        {/* ICON */}

                        <div
                          className={`w-11 h-11 flex-shrink-0 rounded-2xl flex items-center justify-center font-semibold transition group-hover:scale-105 ${
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


                        {/* INFORMATION */}

                        <div className="min-w-0">

                          <p className="font-semibold text-gray-900">

                            {isMerchant
                              ? "Paid to Merchant"
                              : isSent
                              ? "Money Sent"
                              : "Money Received"}

                          </p>


                          <p className="text-sm text-gray-600 mt-0.5 truncate">

                            {isMerchant
                              ? "To"
                              : isSent
                              ? "To"
                              : "From"}{" "}

                            <span className="font-medium">
                              {personName}
                            </span>

                          </p>


                          {personContact && (

                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {personContact}
                            </p>

                          )}


                          <p className="text-xs text-gray-400 mt-1">

                            {new Date(
                              transaction.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div className="text-right ml-4 flex-shrink-0">

                        <p
                          className={`font-semibold ${
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


                        <div className="flex items-center justify-end gap-1 mt-1">

                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>

                          <p className="text-xs text-green-600">
                            Successful
                          </p>

                        </div>

                      </div>

                    </button>

                  );

                })}

            </div>

          )}

        </section>


        {/* ================================================= */}
        {/* TRUST FEATURES */}
        {/* ================================================= */}

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">


          {/* SECURITY */}

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                🔒
              </div>

              <div>

                <p className="font-medium text-gray-900">
                  Secure Payments
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Your payments are protected
                </p>

              </div>

            </div>

          </div>


          {/* FAST */}

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                ⚡
              </div>

              <div>

                <p className="font-medium text-gray-900">
                  Fast Transfers
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Send money instantly
                </p>

              </div>

            </div>

          </div>


          {/* EASY */}

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                ✓
              </div>

              <div>

                <p className="font-medium text-gray-900">
                  Easy to Use
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Simple payment experience
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <footer className="text-center py-8">

          <p className="text-xs text-gray-400">
            PayTM • Secure Digital Payments
          </p>

        </footer>

      </main>

    </div>
  );
}