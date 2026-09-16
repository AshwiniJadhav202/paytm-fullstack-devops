"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Merchant = {
  id: number;
  name: string | null;
  email: string;
  balance: number;
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [merchant, setMerchant] =
    useState<Merchant | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const loadMerchant = async () => {
      try {
        const response = await fetch(
          "/api/merchant"
        );

        if (!response.ok) {
          console.error(
            "Merchant API failed"
          );
          return;
        }

        const data = await response.json();

        console.log(
          "Merchant account data:",
          data
        );

        setMerchant(data.merchant);
      } catch (error) {
        console.error(
          "Error loading merchant:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadMerchant();
  }, [status]);

  if (
    status === "loading" ||
    loading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading account...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!merchant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-600">
          Unable to load merchant account
        </div>
      </div>
    );
  }

  const merchantName =
    merchant.name ||
    session.user?.name ||
    "Merchant";

  const merchantEmail =
    merchant.email ||
    session.user?.email ||
    "";

  const initial =
    merchantName
      .charAt(0)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <header className="fixed left-0 right-0 top-0 z-50 h-[72px] border-b border-gray-200 bg-white">

        <div className="flex h-full items-center justify-between px-8">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              P
            </div>

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                PayTM
              </h1>

              <p className="text-xs text-gray-500">
                Merchant
              </p>

            </div>

          </div>


          {/* USER */}

          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="text-sm font-semibold text-gray-900">
                {merchantName}
              </p>

              <p className="text-xs text-gray-500">
                {merchantEmail}
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {initial}
            </div>

          </div>

        </div>

      </header>


      {/* SIDEBAR */}

      <aside className="fixed bottom-0 left-0 top-[72px] w-[230px] border-r border-gray-200 bg-white">

        <div className="p-5">

          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Menu
          </p>

          <nav className="space-y-2">

            {/* DASHBOARD */}

            <button
              onClick={() =>
                router.push("/")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <span>⌂</span>
              Dashboard
            </button>


            {/* PAYMENTS */}

            <button
              onClick={() =>
                router.push("/payments")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <span>₹</span>
              Payments
            </button>


            {/* TRANSACTIONS */}

            <button
              onClick={() =>
                router.push("/transactions")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <span>◷</span>
              Transactions
            </button>


            {/* ACCOUNT */}

            <button
              onClick={() =>
                router.push("/account")
              }
              className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
            >
              <span>⚙</span>
              Account
            </button>

          </nav>


          {/* SIGN OUT */}

          <button
            onClick={() =>
              signOut({
                callbackUrl: "/signin",
              })
            }
            className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <span>↪</span>
            Sign out
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="ml-[230px] pt-[72px]">

        <div className="mx-auto max-w-6xl px-8 py-8">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <p className="text-sm font-medium text-blue-600">
              Merchant Account
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage your merchant profile and payment information.
            </p>

          </div>


          {/* PROFILE CARD */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-5">

              {/* AVATAR */}

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
                {initial}
              </div>


              {/* PROFILE */}

              <div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {merchantName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {merchantEmail}
                </p>

                <div className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                  Active Merchant
                </div>

              </div>

            </div>

          </div>


          {/* TWO COLUMN AREA */}

          <div className="grid gap-6 lg:grid-cols-2">


            {/* GOOGLE ACCOUNT */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-600">
                  G
                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">
                    Google Account
                  </h3>

                  <p className="text-xs text-gray-500">
                    Authentication provider
                  </p>

                </div>

              </div>


              <div className="mt-6 rounded-xl bg-gray-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Signed in with
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-900">
                  Google
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {merchantEmail}
                </p>

              </div>


              <div className="mt-4 flex items-center gap-2 text-sm text-green-600">

                <span>
                  ✓
                </span>

                <span>
                  Google authentication is active
                </span>

              </div>

            </div>


            {/* MERCHANT INFORMATION */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                  🏪
                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">
                    Merchant Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Your merchant account details
                  </p>

                </div>

              </div>


              <div className="mt-6 space-y-4">

                {/* MERCHANT ID */}

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">

                  <p className="text-sm text-gray-500">
                    Merchant ID
                  </p>

                  <p className="font-mono text-sm font-semibold text-gray-900">
                    MER-{String(
                      merchant.id
                    ).padStart(6, "0")}
                  </p>

                </div>


                {/* ACCOUNT TYPE */}

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">

                  <p className="text-sm text-gray-500">
                    Account Type
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    Merchant
                  </p>

                </div>


                {/* BALANCE */}

                <div className="flex items-center justify-between">

                  <p className="text-sm text-gray-500">
                    Available Balance
                  </p>

                  <p className="text-lg font-bold text-green-600">
                    ₹
                    {merchant.balance.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>

            </div>


            {/* QR PAYMENT */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
                  ▣
                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">
                    QR Payment
                  </h3>

                  <p className="text-xs text-gray-500">
                    Accept payments from customers
                  </p>

                </div>

              </div>


              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">

                <p className="text-sm font-medium text-gray-700">
                  Your Merchant QR Code
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Customers can scan your QR code to open the PayTM payment page and make a payment.
                </p>


                <div className="mt-5 flex items-center justify-between">

                  <div>

                    <p className="text-xs text-gray-400">
                      Merchant ID
                    </p>

                    <p className="mt-1 font-mono text-sm font-semibold text-gray-900">
                      {merchant.id}
                    </p>

                  </div>


                  <button
                    onClick={() =>
                      router.push("/qr")
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View QR Code
                  </button>

                </div>

              </div>

            </div>


            {/* PAYMENT INFORMATION */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
                  ₹
                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">
                    Payment Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Merchant payment status
                  </p>

                </div>

              </div>


              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                  <div>

                    <p className="text-sm font-medium text-gray-700">
                      Payment Acceptance
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Customers can pay using your QR code.
                    </p>

                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                    Active
                  </span>

                </div>


                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                  <div>

                    <p className="text-sm font-medium text-gray-700">
                      Merchant Balance
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Current amount received from customers.
                    </p>

                  </div>

                  <p className="font-bold text-gray-900">
                    ₹
                    {merchant.balance.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* SECURITY */}

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                🔒
              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  Account Security
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Your merchant account is protected using
                  Google authentication and NextAuth session
                  management.
                </p>

                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: "/signin",
                    })
                  }
                  className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  Sign out of merchant account
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}