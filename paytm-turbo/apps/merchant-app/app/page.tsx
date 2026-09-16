"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Payment = {
  id: number;
  amount: number;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    number: string;
  } | null;
};

type Merchant = {
  id: number;
  name: string | null;
  email: string;
  balance: number;
};

type Statistics = {
  totalPayments: number;
  totalReceived: number;
  todayPayments: number;
  todayReceived: number;
};

export default function MerchantDashboard() {
  const router = useRouter();

  const [merchant, setMerchant] = useState<Merchant | null>(null);

  const [statistics, setStatistics] =
    useState<Statistics | null>(null);

  const [recentPayments, setRecentPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/merchant/dashboard",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/signin");
          return;
        }

        setError(
          data.message ||
            "Unable to load merchant dashboard."
        );

        return;
      }

      if (!data.merchant) {
        setError(
          "Merchant information could not be loaded."
        );

        return;
      }

      setMerchant(data.merchant);

      setStatistics(
        data.statistics || {
          totalPayments: 0,
          totalReceived: 0,
          todayPayments: 0,
          todayReceived: 0,
        }
      );

      setRecentPayments(
        Array.isArray(data.recentPayments)
          ? data.recentPayments
          : []
      );
    } catch (error) {
      console.error(
        "Merchant dashboard error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/signin",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="flex min-h-[72px] items-center justify-between gap-4">

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow-sm">
                <span className="text-xl font-bold text-white">
                  P
                </span>
              </div>

              <div>
                <h1 className="text-lg font-bold text-green-600">
                  PayTM
                </h1>

                <p className="text-xs font-medium text-gray-400">
                  Merchant Portal
                </p>
              </div>

            </div>

            {/* MERCHANT + LOGOUT */}

            {!loading && merchant && (
              <div className="flex items-center gap-3">

                <div className="hidden text-right sm:block">

                  <p className="text-sm font-semibold text-gray-900">
                    {merchant.name || "Merchant"}
                  </p>

                  <p className="max-w-[220px] truncate text-xs text-gray-500">
                    {merchant.email}
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="font-bold text-green-700">
                    {merchant.name
                      ? merchant.name
                          .charAt(0)
                          .toUpperCase()
                      : "M"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:px-4"
                >
                  <span className="hidden sm:inline">
                    Logout
                  </span>

                  <span className="sm:hidden">
                    ↪
                  </span>
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm sm:p-16">

            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

            <p className="mt-5 text-sm font-medium text-gray-600">
              Loading merchant dashboard...
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl text-red-600">
                !
              </span>
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load dashboard
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-600">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* ================= DASHBOARD ================= */}

        {!loading &&
          !error &&
          merchant &&
          statistics && (
            <>

              {/* WELCOME */}

              <div className="mb-7">

                <p className="text-sm font-medium text-green-600">
                  Merchant Dashboard
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Welcome,{" "}
                  {merchant.name || "Merchant"}
                </h2>

                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Here's an overview of your merchant
                  account and recent payments.
                </p>

              </div>

              {/* ================= BALANCE ================= */}

              <div className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 p-6 text-white shadow-lg sm:p-8">

                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />

                <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-white/5" />

                <div className="relative">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-sm font-medium text-green-100">
                        Merchant Balance
                      </p>

                      <p className="mt-2 text-3xl font-bold sm:text-4xl">
                        ₹
                        {merchant.balance.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-3 text-sm text-green-100">
                        Available balance
                      </p>

                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                      <span className="text-2xl font-bold">
                        ₹
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* ================= STATISTICS ================= */}

              <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* TOTAL PAYMENTS */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-gray-500">
                      Total Payments
                    </p>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                      <span className="font-bold text-green-600">
                        #
                      </span>
                    </div>

                  </div>

                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    {statistics.totalPayments}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    All customer payments
                  </p>

                </div>

                {/* TOTAL RECEIVED */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-gray-500">
                      Total Received
                    </p>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                      <span className="font-bold text-emerald-600">
                        ₹
                      </span>
                    </div>

                  </div>

                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    ₹
                    {statistics.totalReceived.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Total amount received
                  </p>

                </div>

                {/* TODAY PAYMENTS */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-gray-500">
                      Today's Payments
                    </p>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <span className="font-bold text-blue-600">
                        +
                      </span>
                    </div>

                  </div>

                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    {statistics.todayPayments}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Payments received today
                  </p>

                </div>

                {/* TODAY RECEIVED */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-gray-500">
                      Today's Received
                    </p>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                      <span className="font-bold text-purple-600">
                        ₹
                      </span>
                    </div>

                  </div>

                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    ₹
                    {statistics.todayReceived.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Amount received today
                  </p>

                </div>

              </div>

              {/* ================= RECENT PAYMENTS ================= */}

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">

                  <div>

                    <h3 className="text-lg font-bold text-gray-900">
                      Recent Payments
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Your latest customer payments
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      router.push("/payments")
                    }
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50"
                  >
                    View All →
                  </button>

                </div>

                {/* EMPTY */}

                {recentPayments.length === 0 && (
                  <div className="px-5 py-12 text-center sm:px-6">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-xl font-bold text-gray-400">
                        ₹
                      </span>
                    </div>

                    <p className="mt-4 font-semibold text-gray-900">
                      No payments yet
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Customer payments will appear
                      here.
                    </p>

                  </div>
                )}

                {/* PAYMENTS */}

                {recentPayments.length > 0 && (
                  <div>

                    {recentPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="border-b border-gray-100 px-5 py-5 last:border-b-0 sm:px-6"
                      >

                        <div className="flex items-center justify-between gap-4">

                          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                              <span className="font-bold text-green-600">
                                ₹
                              </span>
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                {payment.user?.name ||
                                  "Customer"}
                              </p>

                              <p className="truncate text-xs text-gray-500 sm:text-sm">
                                {payment.user?.number ||
                                  "Unknown number"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatDate(
                                  payment.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                          <p className="flex-shrink-0 text-sm font-bold text-green-600 sm:text-base">
                            +₹
                            {payment.amount.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* ================= SECURITY ================= */}

              <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <span className="text-green-600">
                      ✓
                    </span>
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-green-900">
                      Merchant account secured
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700">
                      Your merchant dashboard is
                      protected with secure
                      authentication.
                    </p>

                  </div>

                </div>

              </div>

            </>
          )}

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6">

          <p className="text-xs text-gray-400">
            PayTM Merchant Portal
          </p>

        </div>

      </footer>

    </div>
  );
}