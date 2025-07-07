// type PaginationProps = {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// };

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const pagesAroundCurrent = Array.from(
//     { length: Math.min(3, totalPages) },
//     (_, i) => i + Math.max(currentPage - 1, 1)
//   );

//   return (
//     <div className="flex items-center ">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
//       >
//         Previous
//       </button>
//       <div className="flex items-center gap-2">
//         {currentPage > 3 && <span className="px-2">...</span>}
//         {pagesAroundCurrent.map((page) => (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`px-4 py-2 rounded ${
//               currentPage === page
//                 ? "bg-brand-500 text-white"
//                 : "text-gray-700 dark:text-gray-400"
//             } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
//           >
//             {page}
//           </button>
//         ))}
//         {currentPage < totalPages - 2 && <span className="px-2">...</span>}
//       </div>
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;


"use client"

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChevronsLeft } from "lucide-react";
import { useRouter } from 'next/navigation'
import LoadingFirst from '../options/loading';

type props = {
  currentPage: number;
  pages: number;
  params: string;
}

export default function Pagination({ currentPage, pages, params }: props) {

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pages) {
      router.push(`?page=${page}${params}`);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    setIsLoading(false)
  }, [currentPage])

  const generatePageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < pages - 2) {
      if (currentPage < pages - 3) pageNumbers.push("...");
      pageNumbers.push(pages);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div>
      <div className="relative z-0 mx-auto flex gap-5 justify-end items-center">
        <div className="flex items-center gap-2">
          {pages >= 4 && currentPage >= 4 ?
            <span onClick={() => handlePageChange(1)} className="bg-slate-200 hover:bg-slate-300 cursor-pointer rounded-full p-1 sm:p-2">
              <ChevronsLeft size={15} />
            </span>
            : null
          }
          <span onClick={() => handlePageChange(currentPage - 1)} className="bg-slate-200 hover:bg-slate-300 cursor-pointer rounded-full p-1 sm:p-2">
            <ChevronLeft size={15} />
          </span>
          {pageNumbers.map((Num, index) => {
            if (Num === "...") {
              return (
                <span key={index} className="bg-forth dark:text-white rounded-full text-primer sm:py-1 sm:px-3 cursor-pointer hover:bg-third">
                  {Num}
                </span>
              )
            }
            return (
              <span onClick={() => {
                if (Num !== currentPage) {
                  handlePageChange(Number(Num));
                }
              }}
                key={index} className={`${Num == currentPage ? 'bg-fuchsia-400 text-white' : 'bg-forth'} rounded-full dark:text-white px-1 text-sm sm:text-base text-primer border border-primer sm:py-1 sm:px-3 cursor-pointer hover:bg-third`} title={`page${Num}`}>
                {Num}
              </span>
            )
          })}
          <span onClick={() => handlePageChange(currentPage + 1)} className="bg-slate-200 hover:bg-slate-300 cursor-pointer rounded-full p-1 sm:p-2">
            <ChevronRight size={15} />
          </span>
        </div>
      </div>
      <div className={`${isLoading ? '' : 'hidden'} fixed top-0 left-0 right-0 bottom-0 bg-forth bg-opacity-50 flex justify-center items-center`}>
        <LoadingFirst />
      </div>
    </div>
  )
}
