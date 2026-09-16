"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function MerchantPayments() {
  const router = useRouter();

  const [merchant, setMerchant] =
    useState<Merchant | null>(null);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/merchant/payments",
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
            "Unable to load payments."
        );

        return;
      }

      setMerchant(data.merchant || null);

      setPayments(
        Array.isArray(data.payments)
          ? data.payments
          : []
      );
    } catch (error) {
      console.error(
        "Merchant payments error:",
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
    fetchPayments();
  }, []);

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

  const totalReceived = payments.reduce(
    (total, payment) =>
      total + payment.amount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <div className="flex min-h-[72px] items-center justify-between gap-4">

            {/* LEFT SIDE */}

            <div className="flex items-center gap-3">

              <button
                onClick={() => router.push("/")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50"
              >
                ←
              </button>

              <div>

                <h1 className="text-lg font-bold text-gray-900">
                  Payments
                </h1>

                <p className="text-xs text-gray-500">
                  Merchant payment history
                </p>

              </div>

            </div>

            {/* MERCHANT */}

            {!loading && merchant && (
              <div className="flex items-center gap-3">

                <div className="hidden text-right sm:block">

                  <p className="text-sm font-semibold text-gray-900">
                    {merchant.name ||
                      "Merchant"}
                  </p>

                  <p className="max-w-[180px] truncate text-xs text-gray-500">
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

              </div>
            )}

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">

        {/* ================= PAGE TITLE ================= */}

        <div className="mb-7">

          <p className="text-sm font-medium text-green-600">
            Merchant Portal
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Payment History
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            View all payments received from your
            customers.
          </p>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

            <p className="mt-5 text-sm font-medium text-gray-600">
              Loading payments...
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">

              <span className="text-2xl font-bold text-red-600">
                !
              </span>

            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load payments
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchPayments}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* ================= PAYMENTS ================= */}

        {!loading && !error && (
          <>

            {/* ================= SUMMARY ================= */}

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* PAYMENT COUNT */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      Total Payments
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {payments.length}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Customer transactions
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">

                    <span className="font-bold text-green-600">
                      #
                    </span>

                  </div>

                </div>

              </div>

              {/* TOTAL RECEIVED */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      Total Received
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      ₹
                      {totalReceived.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      From listed transactions
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">

                    <span className="text-xl font-bold text-emerald-600">
                      ₹
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= PAYMENT LIST ================= */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* HEADER */}

              <div className="border-b border-gray-200 px-5 py-5 sm:px-6">

                <h3 className="text-lg font-bold text-gray-900">
                  All Payments
                </h3>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Complete history of customer
                  payments.
                </p>

              </div>

              {/* EMPTY STATE */}

              {payments.length === 0 && (
                <div className="px-5 py-14 text-center sm:px-6">

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
                    here once you receive them.
                  </p>

                </div>
              )}

              {/* PAYMENT LIST */}

              {payments.length > 0 && (
                <div>

                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border-b border-gray-100 px-5 py-5 last:border-b-0 sm:px-6"
                    >

                      <div className="flex items-center justify-between gap-4">

                        {/* CUSTOMER */}

                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                          {/* AVATAR */}

                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">

                            <span className="text-lg font-bold text-green-600">
                              {payment.user?.name
                                ? payment.user.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "C"}
                            </span>

                          </div>

                          {/* DETAILS */}

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                              {payment.user?.name ||
                                "Customer"}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
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

                        {/* AMOUNT */}

                        <div className="flex-shrink-0 text-right">

                          <p className="text-sm font-bold text-green-600 sm:text-base">
                            +₹
                            {payment.amount.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <p className="mt-1 text-xs font-medium text-green-500">
                            Received
                          </p>

                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* ================= BACK BUTTON ================= */}

            <div className="mt-6">

              <button
                onClick={() => router.push("/")}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:px-6"
              >
                ← Back to Dashboard
              </button>

            </div>

          </>
        )}

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="mt-4 border-t border-gray-200 bg-white">

        <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:px-6">

          <p className="text-xs text-gray-400">
            PayTM Merchant Portal
          </p>

        </div>

      </footer>

    </div>
  );
}