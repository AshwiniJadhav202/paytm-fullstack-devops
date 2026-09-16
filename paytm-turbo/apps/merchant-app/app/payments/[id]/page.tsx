"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Payment {
  id: number;
  userId: number;
  merchantId: number;
  amount: number;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    number: string;
  };
}

export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const paymentId = params.id;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch("/api/merchant/payments");

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load payment");
          return;
        }

        const foundPayment = data.payments.find(
          (item: Payment) => item.id.toString() === paymentId
        );

        if (!foundPayment) {
          setError("Payment not found");
          return;
        }

        setPayment(foundPayment);
      } catch (error) {
        console.error("Payment details error:", error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <p className="mb-4 text-red-500">
            {error || "Payment not found"}
          </p>

          <button
            onClick={() => router.push("/payments")}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  const paymentDate = new Date(payment.createdAt);

  const date = paymentDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const time = paymentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <header className="fixed left-0 right-0 top-0 z-50 h-[72px] border-b border-gray-200 bg-white">
        <div className="flex h-full items-center justify-between px-8">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer text-2xl font-bold"
          >
            PayTM
          </div>

          <div className="flex items-center gap-5">
            <span className="text-sm text-gray-500">
              Merchant Dashboard
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              M
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}

      <aside className="fixed bottom-0 left-0 top-[72px] w-[230px] border-r border-gray-200 bg-white">
        <div className="px-5 py-7">
          <nav className="space-y-2">
            <button
              onClick={() => router.push("/")}
              className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
            >
              🏠 Dashboard
            </button>

            <button
              onClick={() => router.push("/payments")}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left font-medium text-black"
            >
              💳 Payments
            </button>

            <button
              onClick={() => router.push("/qr")}
              className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
            >
              ▣ QR Code
            </button>

            <button
              onClick={() => router.push("/account")}
              className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
            >
              ⚙ Account
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}

      <main className="ml-[230px] pt-[72px]">
        <div className="mx-auto max-w-4xl px-8 py-10">
          {/* Back */}

          <button
            onClick={() => router.push("/payments")}
            className="mb-6 text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Payments
          </button>

          {/* Title */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Details
            </h1>

            <p className="mt-2 text-gray-500">
              Complete information about this transaction
            </p>
          </div>

          {/* Success Card */}

          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                ✓
              </div>

              <div>
                <p className="font-semibold text-green-700">
                  Payment Successful
                </p>

                <p className="text-sm text-green-600">
                  Money has been received successfully
                </p>
              </div>
            </div>
          </div>

          {/* Amount */}

          <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">
              Payment Amount
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              ₹{payment.amount.toLocaleString("en-IN")}
            </p>

            <p className="mt-2 text-sm text-green-600">
              Successful
            </p>
          </div>

          {/* Customer */}

          <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Customer Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">
                  Customer Name
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {payment.user.name || "Customer"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Mobile Number
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {payment.user.number}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Customer ID
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  #{payment.user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Information */}

          <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Transaction Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">
                  Transaction ID
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  #{payment.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Merchant ID
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  #{payment.merchantId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment Date
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {date}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment Time
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {time}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment Status
                </p>

                <p className="mt-1 font-medium text-green-600">
                  ✓ Successful
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment Type
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  QR Payment
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/payments")}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>

            <button
              onClick={() => router.push("/qr")}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Show QR Code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}