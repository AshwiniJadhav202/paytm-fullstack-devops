"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    if (!phone || !password) {
      alert("Please enter mobile number and password");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        phone: phone,
        password: password,
        redirect: false,
      });

      console.log("Signin result:", result);

      if (result?.error) {
        alert("Invalid mobile number or password");
        return;
      }

      router.push("/");
      router.refresh();

    } catch (error) {
      console.error("Signin error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* Logo */}
        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold italic text-blue-600">
            paytm
          </h1>

          <p className="mt-2 text-gray-500">
            Login to your account
          </p>

        </div>

        {/* Mobile Number */}
        <div className="mb-5">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mobile Number
          </label>

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter mobile number"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Password */}
        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Login Button */}
        <button
          onClick={handleSignin}
          disabled={loading}
          className={`w-full rounded-xl py-3 font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-blue-300"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "LOGGING IN..." : "LOG IN"}
        </button>

        {/* Signup */}
        <div className="mt-6 text-center">

          <p className="text-sm text-gray-500">
            Don't have an account?
          </p>

          <button
            onClick={() => router.push("/signup")}
            className="mt-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign Up
          </button>

        </div>

      </div>

    </div>
  );
}