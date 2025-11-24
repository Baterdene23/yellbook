import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Хүсэлтийн хуудас олдсонгүй</p>
        <Link href="/" className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 inline-block">
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
}
