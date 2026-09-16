"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MerchantPayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const merchantId = searchParams.get("id");
  const merchantName = searchParams.get("name") || "Merchant";

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          router.push("/signin");
          return;
        }

        const data = await response.json();
        setBalance(data.user.balance);
      } catch (error) {
        console.error("Balance error:", error);
      }
    };

    fetchBalance();
  }, [router]);

  const handlePayment = async () => {
    setMessage("");
    setError("");

    const paymentAmount = Number(amount);

    if (!merchantId) {
      setError("Merchant information is missing");
      return;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (balance !== null && paymentAmount > balance) {
      setError("Insufficient balance");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/merchant/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantId: Number(merchantId),
          amount: paymentAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Payment failed");
        return;
      }

      setMessage(`Payment of ₹${paymentAmount} successful`);

      setBalance((previousBalance) =>
        previousBalance !== null
          ? previousBalance - paymentAmount
          : previousBalance
      );

      setAmount("");
    } catch (error) {
      console.error("Payment error:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500">
              Pay Merchant
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {merchantName}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Make a secure payment to this merchant.
            </p>
          </div>

          <div className="mb-6 rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Available balance
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              ₹{balance !== null ? balance.toLocaleString("en-IN") : "..."}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Payment amount
            </label>

            <div className="mt-2 flex items-center rounded-xl border border-gray-300 bg-white px-4">
              <span className="text-lg font-semibold text-gray-500">
                ₹
              </span>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-transparent px-3 py-4 text-lg outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing payment..." : "Pay Merchant"}
          </button>

          <p className="mt-5 text-center text-xs text-gray-400">
            Your payment is processed securely.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MerchantPayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50" />
      }
    >
      <MerchantPayContent />
    </Suspense>
  );
}