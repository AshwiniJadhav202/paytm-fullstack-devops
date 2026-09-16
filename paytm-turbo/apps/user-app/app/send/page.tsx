"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SendMoneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [recipient, setRecipient] = useState(
    searchParams.get("number") || ""
  );

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async () => {
    setError("");
    setSuccess("");

    // =========================
    // VALIDATE RECIPIENT
    // =========================

    if (!recipient.trim()) {
      setError("Please enter the recipient mobile number.");
      return;
    }

    // =========================
    // VALIDATE MOBILE NUMBER
    // =========================

    if (!/^\d{10}$/.test(recipient.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // =========================
    // VALIDATE AMOUNT
    // =========================

    const transferAmount = Number(amount);

    if (!amount.trim()) {
      setError("Please enter the amount.");
      return;
    }

    if (isNaN(transferAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (transferAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    // =========================
    // START TRANSFER
    // =========================

    try {
      setLoading(true);

      const response = await fetch(
        "/api/account/transfer",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            recipient: recipient.trim(),
            amount: transferAmount,
          }),
        }
      );

      const data = await response.json();

      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to complete the transfer."
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      setSuccess(
        `₹${transferAmount.toLocaleString(
          "en-IN"
        )} transferred successfully.`
      );

      setAmount("");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Transfer error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">

        <div className="max-w-5xl mx-auto px-3 sm:px-6">

          <div className="min-h-16 py-3 flex items-center justify-between gap-3">

            {/* BACK BUTTON */}

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition group min-w-0"
            >
              <span className="text-lg sm:text-xl group-hover:-translate-x-0.5 transition">
                ←
              </span>

              <span className="text-xs sm:text-sm font-medium truncate">
                Back to Dashboard
              </span>
            </button>

            {/* LOGO */}

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base sm:text-lg">
                  P
                </span>
              </div>

              <span className="font-bold text-blue-600 text-sm sm:text-base">
                PayTM
              </span>
            </button>

          </div>

        </div>

      </header>

      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <main className="w-full max-w-xl mx-auto px-3 sm:px-6 py-6 sm:py-12">

        {/* ================================= */}
        {/* PAGE TITLE */}
        {/* ================================= */}

        <div className="text-center mb-6 sm:mb-8">

          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">

            <span className="text-2xl sm:text-3xl text-blue-600">
              ↑
            </span>

          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 sm:mt-5 tracking-tight">
            Send Money
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-2 px-2">
            Transfer money securely to another PayTM user.
          </p>

        </div>

        {/* ================================= */}
        {/* MAIN CARD */}
        {/* ================================= */}

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-7">

          {/* ================================= */}
          {/* ERROR */}
          {/* ================================= */}

          {error && (
            <div className="mb-5 sm:mb-6 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">

              <div className="flex gap-3">

                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600">
                    !
                  </span>
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-semibold text-red-800">
                    Transfer failed
                  </p>

                  <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">
                    {error}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ================================= */}
          {/* SUCCESS */}
          {/* ================================= */}

          {success && (
            <div className="mb-5 sm:mb-6 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">

              <div className="flex gap-3">

                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">

                  <span className="text-green-600 font-bold">
                    ✓
                  </span>

                </div>

                <div className="min-w-0">

                  <p className="text-sm font-semibold text-green-800">
                    Transfer successful
                  </p>

                  <p className="text-xs sm:text-sm text-green-700 mt-1 break-words">
                    {success}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ================================= */}
          {/* RECIPIENT SECTION */}
          {/* ================================= */}

          <div className="mb-5 sm:mb-6">

            <div className="flex items-center justify-between gap-2 mb-2">

              <label className="text-sm font-semibold text-gray-800">
                Recipient
              </label>

              <span className="text-[11px] sm:text-xs text-gray-400">
                Mobile number
              </span>

            </div>

            <div className="relative">

              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">

                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">

                  <span className="text-blue-600 text-sm">
                    ☎
                  </span>

                </div>

              </div>

              <input
                type="text"
                inputMode="numeric"
                value={recipient}
                onChange={(e) => {
                  setRecipient(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  );

                  setError("");
                }}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl sm:rounded-2xl pl-14 sm:pl-16 pr-3 sm:pr-4 py-3.5 sm:py-4 text-sm sm:text-base text-gray-900 font-medium outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

            </div>

            <p className="text-[11px] sm:text-xs text-gray-400 mt-2 leading-4">
              Enter the mobile number of the person you want to pay.
            </p>

          </div>

          {/* ================================= */}
          {/* AMOUNT SECTION */}
          {/* ================================= */}

          <div className="mb-6 sm:mb-7">

            <div className="flex items-center justify-between mb-2">

              <label className="text-sm font-semibold text-gray-800">
                Amount
              </label>

              <span className="text-[11px] sm:text-xs text-gray-400">
                INR
              </span>

            </div>

            <div className="relative">

              <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg sm:text-xl font-semibold">
                ₹
              </span>

              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                placeholder="0"
                min="1"
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 text-xl sm:text-2xl font-semibold text-gray-900 outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-300"
              />

            </div>

            <p className="text-[11px] sm:text-xs text-gray-400 mt-2">
              Enter the amount you want to transfer.
            </p>

          </div>

          {/* ================================= */}
          {/* PAYMENT SUMMARY */}
          {/* ================================= */}

          {amount && Number(amount) > 0 && (
            <div className="mb-5 sm:mb-6 bg-slate-50 border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4">

              <div className="flex items-center justify-between gap-3">

                <span className="text-xs sm:text-sm text-gray-500">
                  Transfer amount
                </span>

                <span className="font-semibold text-sm sm:text-base text-gray-900">
                  ₹
                  {Number(amount).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between gap-3 mt-2">

                <span className="text-xs sm:text-sm text-gray-500">
                  Transfer fee
                </span>

                <span className="text-xs sm:text-sm font-medium text-green-600">
                  Free
                </span>

              </div>

              <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between gap-3">

                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  Total
                </span>

                <span className="text-base sm:text-lg font-bold text-gray-900">
                  ₹
                  {Number(amount).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>
          )}

          {/* ================================= */}
          {/* TRANSFER BUTTON */}
          {/* ================================= */}

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition shadow-sm hover:shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed"
          >

            {loading ? (
              <span className="flex items-center justify-center gap-2 sm:gap-3">

                <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/40 border-t-white rounded-full animate-spin">
                </span>

                Processing Transfer...

              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">

                Initiate Transfer

                <span>
                  →
                </span>

              </span>
            )}

          </button>

          {/* ================================= */}
          {/* SECURITY */}
          {/* ================================= */}

          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2">

            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">

              <span className="text-xs">
                🔒
              </span>

            </div>

            <p className="text-[11px] sm:text-xs text-gray-400 text-center">
              Secure payment powered by PayTM
            </p>

          </div>

        </div>

        {/* ================================= */}
        {/* IMPORTANT INFORMATION */}
        {/* ================================= */}

        <div className="mt-4 sm:mt-5 bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-4">

          <div className="flex gap-3">

            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">

              <span className="text-blue-600 text-sm">
                i
              </span>

            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-blue-900">
                Before you transfer
              </p>

              <p className="text-xs sm:text-sm text-blue-700 mt-1 leading-5">
                Make sure the recipient's mobile number
                is correct. Transfers may not be reversible
                after they are completed.
              </p>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* FOOTER */}
        {/* ================================= */}

        <div className="text-center mt-6 sm:mt-8">

          <p className="text-[11px] sm:text-xs text-gray-400">
            PayTM • Simple. Secure. Fast.
          </p>

        </div>

      </main>

    </div>
  );
}

export default function SendMoneyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50" />
      }
    >
      <SendMoneyContent />
    </Suspense>
  );
}