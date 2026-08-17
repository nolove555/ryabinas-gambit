// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080a09] px-10 text-center">
      <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
        LOST POSITION
      </p>

      <h1 className="mt-4 font-serif text-7xl text-[#b73527]">404</h1>

      <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-[#8e806b]">
        This square is empty. The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#a72c20] px-6 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b]"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;