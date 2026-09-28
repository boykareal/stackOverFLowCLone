"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Pagination = ({
  className,
  total,
  limit,
}: {
  className?: string;
  limit: number;
  total: number;
}) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const router = useRouter();
  const pathnanme = usePathname();

  const prev = () => {
    if (pageNumber <= 1) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${pageNumber - 1}`);
    router.push(`${pathnanme}?${newSearchParams}`);
  };

  const next = () => {
    if (pageNumber >= totalPages) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${pageNumber + 1}`);
    router.push(`${pathnanme}?${newSearchParams}`);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={prev}
        disabled={pageNumber <= 1}
      >
        Previous
      </button>
      <span>
        {pageNumber} of {totalPages}
      </span>
      <button
        className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={next}
        disabled={pageNumber >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
