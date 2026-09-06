import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
        Page or Listing Not Found
      </h2>
      <p className="mt-2 text-base text-gray-600 dark:text-gray-400 max-w-md">
        The room or page you are looking for doesn't exist, has been removed, or moved to a new URL.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 transition-colors"
      >
        Back to RongoStay Home
      </Link>
    </div>
  );
}