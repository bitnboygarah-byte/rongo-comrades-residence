"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log runtime error directly to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Something went wrong!
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
        An unexpected error occurred while loading this page. Our team has been notified.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}