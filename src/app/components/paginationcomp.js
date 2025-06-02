'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Pagination ({ totalPages, currentPage }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [page, setPage] = useState(currentPage)

  useEffect(() => {
    setPage(currentPage)
  }, [currentPage])

  const goToPage = pageNum => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNum)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className='flex justify-center items-center gap-2 mt-6'>
      {Array.from({ length: totalPages }, (_, index) => {
        const num = index + 1
        const isActive = num === page
        return (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-4 py-2 rounded-md border transition 
              ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white text-gray-700 hover:bg-blue-100 border-gray-300'
              }`}
          >
            {num}
          </button>
        )
      })}
    </div>
  )
}
