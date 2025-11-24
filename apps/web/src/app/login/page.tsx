"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Нэвтрэх</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Имэйл</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Нууц үг</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Нууц үг"
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-yellow-600 text-white hover:bg-yellow-700">
            Нэвтрэх
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Бүртгэлгүй юу?{" "}
            <Link href="/register" className="text-yellow-600 hover:underline font-medium">
              Бүртгүүлэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
