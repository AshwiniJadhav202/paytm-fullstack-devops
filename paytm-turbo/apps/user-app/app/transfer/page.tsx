"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/Sidebar";

export default function TransferPage() {
  const router = useRouter();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Store actual balance
  const [balance, setBalance] = useState<number>(0);

  // Get balance from PostgreSQL
  useEffect(() => {
    const getBalance = async () => {
      try {
        const response = await fetch("/api/account/balance");

        if (!response.ok) {
          console.error("Failed to fetch balance");
          return;
        }

        const data = await response.json();

        setBalance(data.balance);
      } catch (error) {
        console.error("Balance error:", error);
      }
    };

    getBalance();
  }, []);

  // Handle Transfer
  const handleTransfer = async () => {
    if (!recipient || !amount) {
      alert("Please enter recipient and amount");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (Number(amount) > balance) {
      alert("Insufficient balance");
      return;
    }

    try {
      const response = await fetch("/api/account/transfer", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          recipient,
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Transfer failed");
        return;
      }

      alert("Transfer successful!");

      // Clear input fields
      setRecipient("");
      setAmount("");

      // Go to home page
      router.push("/");
    } catch (error) {
      console.error("Transfer error:", error);

      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900">

      {/* Top Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">

        <div className="text-3xl font-bold italic text-blue-600">
          paytm
        </div>

        <div className="flex items-center gap-4">

          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            U
          </div>

          <button
            onClick={() => router.push("/signin")}
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Logout
          </button>

        </div>

      </header>


      <div className="flex">

        {/* Sidebar */}
        <Sidebar />


        {/* Main Content */}
        <main className="ml-[230px] flex-1 p-8">

          {/* Heading */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold">
              Transfer
            </h1>

            <p className="mt-2 text-gray-500">
              Send money securely to another PayTM user.
            </p>

          </div>


          {/* Tabs */}
          <div className="mb-8 flex gap-8 border-b">

            <button
              className="border-b-2 border-blue-600 pb-3 font-semibold text-blue-600"
            >
              Transfer
            </button>

            <button
              onClick={() => router.push("/")}
              className="pb-3 text-gray-500 hover:text-gray-900"
            >
              Deposit
            </button>

            <button
              className="pb-3 text-gray-500 hover:text-gray-900"
            >
              Withdraw
            </button>

          </div>


          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">


            {/* Transfer Form */}
            <div className="rounded-2xl bg-white p-7 shadow-sm lg:col-span-2">

              <h2 className="mb-6 text-xl font-semibold">
                Send Money
              </h2>


              {/* Recipient */}
              <div className="mb-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Recipient
                </label>

                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter phone number or username"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Amount */}
              <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>


              {/* Pay button */}
              <button
                onClick={handleTransfer}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                PAY NOW
              </button>

            </div>


            {/* Right Side */}
            <div className="space-y-6">


              {/* Balance */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">

                <p className="text-sm text-gray-500">
                  Available Balance
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  ₹{balance.toLocaleString("en-IN")}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  INR
                </p>

              </div>


              {/* Security */}
              <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-sm">

                <div className="mb-4 text-3xl">
                  🔒
                </div>

                <h2 className="text-lg font-semibold">
                  Secure Transfer
                </h2>

                <p className="mt-2 text-sm text-blue-100">
                  Your money transfer is protected and processed securely.
                </p>

              </div>


              {/* Recent */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">

                <h2 className="mb-4 font-semibold">
                  Recent Transfers
                </h2>

                <p className="text-sm text-gray-400">
                  No recent transfers
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}