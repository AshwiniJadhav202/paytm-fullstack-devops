"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">

      {/* ================= HEADER ================= */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-extrabold italic tracking-tight text-blue-600">
            paytm
          </h1>
        </div>

        {/* Header Buttons */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => router.push("/signin")}
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Log in
          </button>

          <button
            onClick={() => {
              window.location.href = "http://localhost:3002";
            }}
            className="rounded-full border border-gray-400 px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
          >
            Merchant login
          </button>

        </div>

      </header>


      {/* ================= HERO SECTION ================= */}
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">

        <section className="overflow-hidden rounded-[28px] bg-[#dcecf9]">

          <div className="grid min-h-[520px] items-center gap-10 p-8 md:grid-cols-2 md:p-14">

            {/* ================= LEFT CONTENT ================= */}
            <div className="max-w-xl">

              <h2 className="text-5xl font-medium leading-[1.05] tracking-tight text-gray-900 md:text-6xl">
                Fast, safe
                <br />
                social
                <br />
                payments
              </h2>

              <p className="mt-7 max-w-md text-base leading-7 text-gray-700">
                Pay, get paid, grow a business, and more.
                Join millions of people using PayTM for
                fast and secure payments.
              </p>

              <button
                onClick={() => router.push("/signin")}
                className="mt-8 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Get PayTM
              </button>

            </div>


            {/* ================= RIGHT IMAGE ================= */}
            <div className="relative">

              <div className="overflow-hidden rounded-[24px]">

                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85"
                  alt="Friends enjoying time together"
                  className="h-[360px] w-full object-cover md:h-[430px]"
                />

              </div>


              {/* Payment notification */}
              <div className="absolute bottom-6 left-6 rounded-xl bg-white px-5 py-4 shadow-lg">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    💰
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Payment received
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      ₹2,500
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= BOTTOM FEATURES ================= */}
        <section className="grid gap-6 py-14 md:grid-cols-3">

          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
              ⚡
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Fast payments
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Send and receive money quickly with a simple
              and convenient payment experience.
            </p>
          </div>


          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl">
              🔒
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Safe and secure
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your payments and account information are
              protected with secure authentication.
            </p>
          </div>


          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-xl">
              👥
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Pay your people
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Easily send money to friends, family, and
              other PayTM users.
            </p>
          </div>

        </section>

      </main>

    </div>
  );
}