"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface BalanceData {
  balance: number;
}

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Get logged-in user
        const userResponse = await fetch("/api/user");

        if (!userResponse.ok) {
          router.push("/signin");
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        // Get account balance
        const balanceResponse = await fetch("/api/account/balance");

        if (!balanceResponse.ok) {
          throw new Error("Unable to load balance");
        }

        const balanceData: BalanceData =
          await balanceResponse.json();

        setBalance(balanceData.balance);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError("Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/signin",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer"
            >
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
                PayTM
              </h1>

              <p className="hidden sm:block text-xs text-gray-500">
                Digital Payments
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
              >
                Dashboard
              </button>

              <button
                onClick={() => router.push("/transactions")}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Transactions
              </button>

              <button
                onClick={() => router.push("/account")}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Account
              </button>
            </nav>

            {/* User + Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-2 mt-4 overflow-x-auto pb-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="whitespace-nowrap px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/transactions")}
              className="whitespace-nowrap px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
            >
              Transactions
            </button>

            <button
              onClick={() => router.push("/account")}
              className="whitespace-nowrap px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
            >
              Account
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome */}
        <section className="mb-6 sm:mb-8">
          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {user?.name || "User"} 👋
          </h2>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage your money and payments from one place.
          </p>
        </section>

        {/* Balance + Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm">
                  Available Balance
                </p>

                <h3 className="text-3xl sm:text-4xl font-bold mt-3 break-words">
                  ₹{balance.toLocaleString("en-IN")}
                </h3>
              </div>

              <div className="bg-white/10 rounded-xl p-3 text-2xl">
                ₹
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/20">
              <p className="text-blue-100 text-xs sm:text-sm">
                Your current wallet balance
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 mt-4">
              <button
                onClick={() => router.push("/send")}
                className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-left transition"
              >
                <div className="text-xl mb-2">
                  💸
                </div>

                <p className="font-semibold">
                  Send Money
                </p>

                <p className="text-xs text-blue-500 mt-1">
                  Transfer money
                </p>
              </button>

              <button
                onClick={() => router.push("/transactions")}
                className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-left transition"
              >
                <div className="text-xl mb-2">
                  📄
                </div>

                <p className="font-semibold">
                  Transactions
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  View history
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-6 sm:mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Manage Your Account
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Send Money */}
            <button
              onClick={() => router.push("/send")}
              className="bg-white border rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-200 transition"
            >
              <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                💸
              </div>

              <h4 className="font-semibold text-gray-900 mt-4">
                Send Money
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Send money securely to another PayTM user.
              </p>

              <p className="text-blue-600 text-sm font-medium mt-4">
                Send now →
              </p>
            </button>

            {/* Transactions */}
            <button
              onClick={() => router.push("/transactions")}
              className="bg-white border rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-200 transition"
            >
              <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                📊
              </div>

              <h4 className="font-semibold text-gray-900 mt-4">
                Transactions
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Check your complete payment and transfer history.
              </p>

              <p className="text-blue-600 text-sm font-medium mt-4">
                View history →
              </p>
            </button>

            {/* Account */}
            <button
              onClick={() => router.push("/account")}
              className="bg-white border rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-200 transition sm:col-span-2 lg:col-span-1"
            >
              <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
                👤
              </div>

              <h4 className="font-semibold text-gray-900 mt-4">
                My Account
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                View your profile and account information.
              </p>

              <p className="text-blue-600 text-sm font-medium mt-4">
                View account →
              </p>
            </button>
          </div>
        </section>

        {/* Security Notice */}
        <section className="mt-6 sm:mt-8 bg-white border rounded-2xl p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="text-2xl">
              🔒
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Your account is protected
              </h3>

              <p className="text-sm text-gray-500 mt-1 leading-6">
                Keep your login credentials private and always
                make sure you are using the official PayTM
                application.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-8 sm:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            © 2026 PayTM. Secure digital payments.
          </p>
        </div>
      </footer>
    </div>
  );
}