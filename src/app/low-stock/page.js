'use client'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { House, FileText, Trash2 } from 'lucide-react'
import { LoginUserFunc } from '../context/loginuser'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable' // <== important!
import LoadingSpinner from '../components/waiting'

export default function LowInvStock () {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [showfilter, setShowFilter] = useState(false)
  const { user } = LoginUserFunc()
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState([])
  const [page, setpage] = useState(1)

  const handleprev = () => {
    if (page > 1) {
      const newPage = page - 1
      setpage(newPage)
      fetchRecords(newPage)
    }
  }

  const handlenext = () => {
    const newPage = page + 1
    setpage(newPage)
    fetchRecords(newPage)
  }
  async function fetchRecords (pageNumber = 1) {
    setloading(true)
    try {
      const res = await fetch(`/api/lowstock?page=${pageNumber}`)
      const data = await res.json()
      setdata(data)
      setloading(false)
    } catch (err) {
      alert(err.message)
      setloading(false)
    }
  }

  useEffect(() => {
    fetchRecords(page)
  }, [])

  const handleExcelExport = () => {
    const exportData = filteredQuotations.map(item => ({
      Date: moment(item.date).format('DD/MM/YYYY'),
      OrderID: item.orderId,
      Client: item.clientName,
      Company: item.companyName,
      Salesperson: item.saleperson
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotations')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'Quotations.xlsx')
  }

  const handlePDFExport = () => {
    const doc = new jsPDF()
    const tableData = filteredQuotations.map(item => [
      moment(item.date).format('DD/MM/YYYY'),
      item.orderId,
      item.clientName,
      item.companyName,
      item.saleperson
    ])

    autoTable(doc, {
      head: [['Date', 'Order ID', 'Client', 'Company', 'Salesperson']],
      body: tableData
    })
    doc.save('Quotations.pdf')
  }

  return (
    <>
      {loading && <LoadingSpinner />}

      <div className='px-4 py-2 bg-gray-100'>
        <div className='flex flex-wrap justify-between gap-2 mb-4'>
          <div className='flex items-center gap-x-4'>
            <button
              onClick={() => router.push('/dashboard')}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition'
            >
              <House className='w-5 h-5' />
              Home
            </button>
            <h1 className='text-2xl font-bold'>Low Inv Stock</h1>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {user.user?.role == 'admin' && (
              <button
                onClick={handleExcelExport}
                className='px-4 py-2 bg-green-600 text-white rounded-md'
              >
                Export Excel
              </button>
            )}
            {user.user?.role == 'admin' && (
              <button
                onClick={handlePDFExport}
                className='px-4 py-2 bg-red-600 text-white rounded-md'
              >
                Export PDF
              </button>
            )}
            <button
              onClick={() => setShowFilter(!showfilter)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md'
            >
              {showfilter ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* {showfilter && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <input
            type='text'
            placeholder='Search...'
            className='p-2 border rounded'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <input
            type='text'
            placeholder='Filter by Salesperson'
            className='p-2 border rounded'
            value={filterSalesperson}
            onChange={e => setFilterSalesperson(e.target.value)}
          />
          <input
            type='text'
            placeholder='Filter by Client Name'
            className='p-2 border rounded'
            value={filterClientName}
            onChange={e => setFilterClientName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Filter by Company'
            className='p-2 border rounded'
            value={filterCompany}
            onChange={e => setFilterCompany(e.target.value)}
          />
        </div>
      )} */}

        <div className='overflow-x-auto shadow-md rounded-lg max-h-120'>
          <table className='min-w-full table-auto border-collapse'>
            <thead className='sticky top-0 bg-blue-600 text-white'>
              {[
                'Design',
                'Company',
                'Batch',
                'Size',
                'Type',
                'Weight',
                'Pcs/Box',
                'Location',
                'Min. Qty',
                'Max. Qty',
                'Op. Stock',
                'Hold Stock',
                'Cl. Stock'
              ].map((item, index) => (
                // <tr>
                <th key={index} className='px-2 py-1 text-center'>
                  {item}
                </th>
                // </tr>
              ))}
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {data.map((d, index) => (
                <tr key={index} className='odd:bg-gray-200 even:bg-white'>
                  <td className='px-2 text-center py-1 text-xs'>
                    {d.designname}
                  </td>
                  <td className='px-2 text-center py-1 text-xs'>{d.coname}</td>
                  <td className='px-2 text-center py-1 text-xs'>{d.batchno}</td>
                  <td className='px-2 text-center py-1 text-xs'>{d.size}</td>
                  <td className='px-2 text-center py-1 text-xs'>{d.type}</td>
                  <td className='px-2 text-center py-1 text-xs'>{d.weight}</td>
                  <td className='px-2 text-center py-1 text-xs'>
                    {d.pcperbox}
                  </td>
                  <td className='px-2 text-center py-1 text-xs'>
                    {d.location}
                  </td>
                  <td className='px-2 text-center py-1 text-xs'>{d.minqty}</td>
                  <td className='px-2 text-center py-1 text-xs'>{d.maxqty}</td>
                  <td className='px-2 text-center py-1 text-xs'>{d.opstock}</td>
                  <td className='px-2 text-center py-1 text-xs'>
                    {d.holdstock}
                  </td>
                  <td className='px-2 text-center py-1 text-xs'>
                    {d.closingstock}
                  </td>
                </tr>
              ))}
              {/* : (
            <tr>
              <td colSpan='6' className='text-center py-4 text-gray-500'>
                No quotations found.
              </td>
            </tr>
            ) */}
            </tbody>
          </table>
        </div>

        <div className='flex justify-between px-5 items-center max-w-100 m-auto mt-5'>
          <button
            className='bg-yellow-500 px-5 py-2 rounded-2xl border-1'
            onClick={() => {
              handleprev()
            }}
          >
            Prev
          </button>
          <p>
            <strong>{page}</strong>
          </p>
          <button
            className='bg-green-500 px-5 py-2 rounded-2xl border-1'
            onClick={() => {
              handlenext()
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}
