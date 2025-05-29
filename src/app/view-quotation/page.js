'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LoginUserFunc } from '../context/loginuser'

export default function ViewQuotation () {
  const [quotations, setQuotations] = useState([])

  async function fetchQuotation () {
    try {
      const req = await fetch('/api/quotation')
      const res = await req.json()
      setQuotations(res.data)
      console.log(res.data)
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    fetchQuotation()
  }, [])

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-6'>Quotation List</h1>

      <div className='overflow-x-auto shadow-md rounded-lg'>
        <table className='min-w-full table-auto border-collapse'>
          <thead className='bg-blue-600 text-white'>
            <tr>
              <th className='px-4 py-3 text-left'>Order ID</th>
              <th className='px-4 py-3 text-left'>Date</th>
              <th className='px-4 py-3 text-left'>Client Name</th>
              <th className='px-4 py-3 text-left'>Company Name</th>
              <th className='px-4 py-3 text-left'>Salesperson</th>

              <th className='px-4 py-3 text-left'>Action</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {quotations.map((q, index) => (
              <tr key={index} className='hover:bg-gray-100 transition'>
                <td className='px-4 py-2'>{q.orderId}</td>
                <td className='px-4 py-2'>
                  {new Date(q.date).toLocaleDateString()}
                </td>
                <td className='px-4 py-2'>{q.clientName}</td>
                <td className='px-4 py-2'>{q.companyName}</td>
                <td className='px-4 py-2'>{q.saleperson}</td>
                <td className='px-4 py-2'>
                  <Link
                    href={`/quotation/${q.orderId}`}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm'
                  >
                    View Quotation
                  </Link>
                </td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center py-4 text-gray-500'>
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
