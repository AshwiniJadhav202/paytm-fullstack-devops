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

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto">
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Loading account...
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Please wait
          </p>

        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center max-w-sm w-full">

          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">

            <span className="text-red-600 text-2xl">
              ⚠
            </span>

          </div>

          <h2 className="text-lg font-semibold text-gray-900 mt-4">
            Account unavailable
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            User information could not be loaded.
          </p>

          <button
            onClick={() => router.push("/signin")}
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Sign In
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex items-center justify-between gap-4">

            {/* LEFT */}

            <div className="flex items-center gap-3 min-w-0">

              <button
                onClick={() => router.push("/")}
                className="group w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 transition flex-shrink-0"
              >
                <span className="text-xl transition-transform group-hover:-translate-x-1">
                  ←
                </span>
              </button>

              <div className="min-w-0">

                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  My Account
                </h1>

                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Manage your account information
                </p>

              </div>

            </div>


            {/* PAYTM LOGO */}

            <div className="flex items-center gap-2 flex-shrink-0">

              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">

                <span className="text-white font-bold text-lg">
                  P
                </span>

              </div>

              <span className="hidden sm:block font-bold text-blue-600 text-lg">
                PayTM
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">

          {/* COVER */}

          <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative">

            <div className="absolute inset-0 bg-white/5">
            </div>

          </div>


          {/* PROFILE CONTENT */}

          <div className="px-5 sm:px-6 pb-6">

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-5">

              {/* PROFILE AVATAR */}

              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg flex-shrink-0">

                <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">

                  <span className="text-3xl font-bold text-blue-600">

                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : "U"}

                  </span>

                </div>

              </div>


              {/* NAME */}

              <div className="pb-1 min-w-0">

                <h2 className="text-2xl font-bold text-gray-900 truncate">

                  {user.name || "User"}

                </h2>

                <div className="flex items-center gap-2 mt-1">

                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    PayTM User
                  </span>

                  <span className="hidden sm:inline text-xs text-gray-400">
                    •
                  </span>

                  <span className="hidden sm:inline text-xs text-gray-500">
                    ID #{user.id}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= BALANCE ================= */}

        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-7 text-white shadow-sm mb-6">

          {/* Decorative circles */}

          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10">
          </div>

          <div className="absolute -right-4 -bottom-12 w-40 h-40 rounded-full bg-white/5">
          </div>


          <div className="relative flex items-center justify-between gap-5">

            <div>

              <p className="text-blue-100 text-sm font-medium">
                Available Balance
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight">

                ₹{user.balance.toLocaleString("en-IN")}

              </h2>

              <p className="text-blue-100 text-xs mt-2">
                Current account balance
              </p>

            </div>


            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">

              <span className="text-2xl sm:text-3xl font-bold">
                ₹
              </span>

            </div>

          </div>

        </div>


        {/* ================= ACCOUNT INFORMATION ================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* SECTION HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-200">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Account Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your registered PayTM account details
                </p>

              </div>

              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">

                <span className="text-blue-600">
                  👤
                </span>

              </div>

            </div>

          </div>


          {/* DETAILS */}

          <div className="divide-y divide-gray-100">

            {/* NAME */}

            <div className="px-5 sm:px-6 py-5 hover:bg-gray-50 transition">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                  <span className="text-blue-600">
                    👤
                  </span>

                </div>

                <div className="min-w-0">

                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Full Name
                  </p>

                  <p className="font-semibold text-gray-900 mt-1 truncate">
                    {user.name || "Not available"}
                  </p>

                </div>

              </div>

            </div>


            {/* MOBILE NUMBER */}

            <div className="px-5 sm:px-6 py-5 hover:bg-gray-50 transition">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">

                  <span className="text-green-600">
                    📱
                  </span>

                </div>

                <div className="min-w-0">

                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Mobile Number
                  </p>

                  <p className="font-semibold text-gray-900 mt-1 truncate">
                    {user.number}
                  </p>

                </div>

              </div>

            </div>


            {/* EMAIL */}

            <div className="px-5 sm:px-6 py-5 hover:bg-gray-50 transition">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">

                  <span className="text-purple-600">
                    ✉
                  </span>

                </div>

                <div className="min-w-0">

                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email Address
                  </p>

                  <p className="font-semibold text-gray-900 mt-1 truncate">
                    {user.email || "Not provided"}
                  </p>

                </div>

              </div>

            </div>


            {/* USER ID */}

            <div className="px-5 sm:px-6 py-5 hover:bg-gray-50 transition">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">

                  <span className="text-orange-600 font-bold">
                    #
                  </span>

                </div>

                <div>

                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    User ID
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {user.id}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= SECURITY ================= */}

        <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-5">

          <div className="flex gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">

              <span className="text-green-600">
                🔒
              </span>

            </div>

            <div>

              <h3 className="font-semibold text-green-900">
                Account secured
              </h3>

              <p className="text-sm text-green-700 mt-1 leading-relaxed">
                Your account information is protected
                using secure authentication.
              </p>

            </div>

          </div>

        </div>


        {/* ================= BACK BUTTON ================= */}

        <div className="mt-6">

          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.99] transition shadow-sm"
          >
            Back to Dashboard
          </button>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-200 bg-white mt-8">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

          <p className="text-center text-xs text-gray-400">
            Secure payments powered by PayTM
          </p>

        </div>

      </footer>

    </div>
  );
}