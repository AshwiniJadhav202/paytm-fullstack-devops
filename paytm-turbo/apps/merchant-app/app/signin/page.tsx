"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function MerchantSignin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignin = async () => {
    try {
      setLoading(true);

      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error(
        "Google sign in error:",
        error
      );

      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">

      <div className="w-full max-w-md">

        {/* CARD */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">

          {/* LOGO */}

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 shadow-lg">
              <span className="text-2xl font-bold text-white">
                P
              </span>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              PayTM Merchant
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to manage your merchant
              account and payments.
            </p>

          </div>

          {/* GOOGLE BUTTON */}

          <button
            onClick={handleGoogleSignin}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >

            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white">

              <span className="text-sm font-bold">
                G
              </span>

            </div>

            {loading
              ? "Signing in..."
              : "Continue with Google"}

          </button>

          {/* SECURITY */}

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex gap-3">

              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm text-blue-600">
                  🔒
                </span>
              </div>

              <div>

                <p className="text-sm font-semibold text-gray-800">
                  Secure merchant login
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Your account is protected using
                  secure Google authentication.
                </p>

              </div>

            </div>

          </div>

          {/* BACKGROUND INFO */}

          <div className="mt-7 text-center">

            <p className="text-xs text-gray-400">
              PayTM Merchant Portal
            </p>

          </div>

        </div>

        {/* FOOTER */}

        <p className="mt-5 text-center text-xs text-gray-400">
          Secure payments management
        </p>

      </div>

    </div>
  );
}