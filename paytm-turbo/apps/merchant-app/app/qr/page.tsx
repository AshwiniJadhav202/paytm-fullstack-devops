"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Merchant {
  id: number;
  name: string | null;
  email: string;
  balance: number;
}

export default function QRPage() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const response = await fetch("/api/merchant");
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load merchant");
          return;
        }

        const merchantData = data.merchant;

        setMerchant(merchantData);

        const paymentUrl =
  `http://192.168.1.2:3001` +
  `/merchant-pay?id=${merchantData.id}` +
  `&name=${encodeURIComponent(
    merchantData.name || "Merchant"
  )}`;

        console.log("QR Payment URL:", paymentUrl);

        const qr = await QRCode.toDataURL(paymentUrl, {
          width: 320,
          margin: 2,
        });

        setQrCode(qr);
      } catch (error) {
        console.error("QR generation error:", error);
        setError("Unable to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Generating payment QR...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

          <p className="text-sm font-medium text-blue-600">
            PayTM Merchant
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Receive Payments
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Ask your customer to scan this QR code to make a payment.
          </p>

          {qrCode && (
            <div className="mx-auto mt-8 flex w-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <img
                src={qrCode}
                alt="Merchant payment QR code"
                className="h-72 w-72"
              />
            </div>
          )}

          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Merchant
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {merchant?.name || "Merchant"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {merchant?.email}
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-5 text-left">
            <p className="text-sm font-semibold text-blue-900">
              How it works
            </p>

            <ol className="mt-3 space-y-2 text-sm text-blue-800">
              <li>
                1. Customer scans your QR code.
              </li>

              <li>
                2. Customer enters the payment amount.
              </li>

              <li>
                3. Customer confirms the payment.
              </li>

              <li>
                4. Money is added to your merchant balance.
              </li>
            </ol>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Current Balance
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              ₹
              {typeof merchant?.balance === "number"
                ? merchant.balance.toLocaleString("en-IN")
                : "0"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}