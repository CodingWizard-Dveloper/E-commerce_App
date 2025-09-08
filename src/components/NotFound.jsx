import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100/60 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-extrabold text-gray-900 tracking-widest">
        404
      </h1>
      <p className="mt-4 text-2xl font-semibold text-gray-700">
        Oops! Page not found
      </p>
      <p className="mt-2 text-gray-500">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium shadow hover:bg-indigo-700 transition"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-3 text-white font-medium shadow hover:bg-gray-900 transition"
        >
          <ShoppingBag className="h-5 w-5" />
          Shop Now
        </Link>
      </div>
    </div>
  );
}
