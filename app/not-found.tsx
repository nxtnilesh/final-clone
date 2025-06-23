"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-800 text-black dark:text-white px-4">
      <div className="flex flex-col  space-y-4 text-sm">
        <Sparkles className="h-12 w-12 text-gray-500 dark:text-gray-400" />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          404 - Page Not Found
        </h1>
        <p className=" text-gray-600 dark:text-gray-400 max-w-sm">
          The link was a dream, a shadow of what once was—now, nothing remains.
        </p>
        <Link href="/chat" passHref>
          <Button className="mt-4 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-sm">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
