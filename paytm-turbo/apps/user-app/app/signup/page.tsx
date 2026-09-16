"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        name,
        phone,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert("Unable to create account");
        return;
      }

      alert("Account created successfully!");

      router.push("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-[400px] rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
          Create Account
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500">
          Create your Paytm account
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Phone Number
          </label>

          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Signup button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Signin */}
        <button
          onClick={() => router.push("/signin")}
          className="mt-4 w-full rounded-lg border px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          Already have an account? Sign In
        </button>

      </div>
    </div>
  );
}