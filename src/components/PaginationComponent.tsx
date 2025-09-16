"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import usePaginationStore from "@/hooks/usePaginationStore";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationComponent({
  totalCount,
}: {
  totalCount: number;
}) {
  const setPage = usePaginationStore((state) => state.setPage);
    const setPageSize = usePaginationStore((state) => state.setPageSize);
    const setPagination = usePaginationStore((state) => state.setPagination);
    const pagination = usePaginationStore((state) => state.pagination);

  const { pageNumber, pageSize, totalPages } = pagination;

  useEffect(() => {
    setPagination(totalCount);
  }, [setPagination, totalCount]);

  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);
  const resultText = `Showing ${start}-${end} of ${totalCount} results`;

  return (
    <div className="border-t w-full mt-5">
      <div className="flex flex-row justify-between items-center py-5">
        <div className="text-sm text-muted-foreground">{resultText}</div>

        {/* ShadCN Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, pageNumber - 1))}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => setPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage(Math.min(totalPages, pageNumber + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Page Size Selector */}
        <div className="flex flex-row gap-2 items-center">
          <span className="text-sm">Page size:</span>
          {[3, 6, 12].map((size) => (
            <button
              key={size}
              onClick={() => setPageSize(size)}
              className={clsx(
                "px-2 py-1 rounded-md border text-sm transition",
                pageSize === size
                  ? "bg-foreground text-white"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
