import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Хуудас олдсонгүй
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Таны хайж буй хуудас олдсонгүй. Доорх товчыг дарж Шар номын жагсаалт руу буцна уу.
      </p>
      <Link href="/yellow-books">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Шар ном руу очих
        </Button>
      </Link>
    </div>
  );
}
