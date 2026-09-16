"use client";

import { usePathname, useRouter } from "next/navigation";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-[72px] block w-[230px] border-r border-gray-200 bg-white">

      <div className="px-5 py-7">

        <nav className="space-y-2">

          {/* Home */}
          <button
            onClick={() => router.push("/")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              pathname === "/"
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-lg">⌂</span>
            Home
          </button>


          {/* Explore */}
          <button
            onClick={() => router.push("/explore")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              pathname.startsWith("/explore")
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-lg">⌕</span>
            Explore
          </button>


          {/* Rewards */}
          <button
            onClick={() => router.push("/rewards")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              pathname.startsWith("/rewards")
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-lg">%</span>
            Rewards
          </button>


          {/* Transfer */}
          <button
            onClick={() => router.push("/transfer")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              pathname.startsWith("/transfer")
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-lg">⇄</span>
            Transfer
          </button>


          {/* Transactions */}
          <button
            onClick={() => router.push("/transactions")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              pathname.startsWith("/transactions")
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-lg">◷</span>
            Transactions
          </button>

            <button
            onClick={() => router.push("/account")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                pathname.startsWith("/account")
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            >
            <span className="text-lg">⚙</span>
            Account
            </button>

        </nav>

      </div>

    </aside>
  );
}