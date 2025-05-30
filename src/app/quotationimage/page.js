// Editable Quotation Page Matching PDF Design
'use client'
import { useState, useEffect, useRef } from 'react'
import { LoginUserFunc } from '../context/loginuser'
import { House } from 'lucide-react'
import { useRouter } from 'next/navigation'
// import { set } from 'mongoose'

export default function QuotationPage () {
  const router = useRouter()
  const { user } = LoginUserFunc()
  // const converter = require('number-to-words');
  const [rightread, setrightread] = useState(false)
  const [rightcreate, setrightcreate] = useState(false)
  const [rightedit, setrightedit] = useState(false)
  const [rightdelete, setrightdelete] = useState(false)
  
  const [showCharges, setShowCharges] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showimagename, setShowimagename] = useState(true)

  useEffect(() => {
    setrightread(user.user?.pquotationimage.includes('read') || false)
    setrightcreate(user.user?.pquotationimage.includes('create') || false)
    setrightedit(user.user?.pquotationimage.includes('update') || false)
    setrightdelete(user.user?.pquotationimage.includes('delete') || false)
  }, [user])

  const [quotation, setQuotation] = useState({
    orderId: `Q-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`, // Order ID in format Q-YYYYMMDD,
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    clientName: 'Abc',
    companyName: 'Abc Industries',
    saleperson: user.user?.name || '',
    billingAddress: '123 Billing Address, City',
    shippingAddress: '456 Shipping Address, City',
    gst: '29ABCDE1234F2Z5',
    items: [
      {
        description: 'Tile A',
        size: '2x2',
        qtypersqft: 10,
        qtyperbox: 10,
        price: 20,
        image: '' // ✅ new
      }
    ],
    discount: 0,
    gstRate: 18,
    cuttingCharges: 0,
    cartageCharges: 0,
    packingCharges: 0
  })

  const bankDetail = [
    { bank: 'DEUTSCHE BANK' },
    { 'a/c name': 'ANTICA CERAMICA LLP' },
    { Account: '100040626900019' },
    { ifsc: 'DEUT0784PBC' },
    { branch: 'KASTURBA GANDHI MARG' }
  ]
  const termcondition = [
    'Payment 100% Advance',
    'Delivery After 10-15 Days After PO & payment',
    'Goods will not return once sold',
    'Disputes subject to Delhi jurisdiction only',
    'Unloading Charges Extra',
    'Transportation damage 3% will be accepted.'
  ]

  const handleItemChange = (index, field, value) => {
    const newItems = [...quotation.items]
    newItems[index][field] =
      field === 'qtypersqft' || field === 'qtyperbox' || field === 'price'
        ? Number(value)
        : value
    setQuotation({ ...quotation, items: newItems })
  }

  const addItem = () => {
    setShowimagename(true)
    setQuotation({
      ...quotation,
      items: [
        ...quotation.items,
        { description: '', size: '', qtypersqft: 0, qtyperbox: 0, price: 0 }
      ]
    })
  }

  const deleteItem = index => {
    const items = quotation.items.filter((_, i) => i !== index)
    setQuotation({ ...quotation, items })
  }

  const printPage = () => {
    window.print()
  }

  const subtotal = quotation.items.reduce(
    (sum, item) => sum + item.qtypersqft * item.price,
    0
  )

  const discountAmt = (subtotal * quotation.discount) / 100
  const afterDiscount = subtotal - discountAmt
  const gstAmt = (afterDiscount * quotation.gstRate) / 100
  const grandTotal =
    afterDiscount +
    gstAmt +
    Number(quotation.cuttingCharges || 0) +
    Number(quotation.cartageCharges || 0) +
    Number(quotation.packingCharges || 0)

  const handleSubmit = async () => {
    const method = 'POST'
    const url = '/api/quotation'

    let res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotation)
    })

    let result = await res.json()
    if (result.success) {
      alert('Quotation Save Scussfully ')
    } else {
      console.log('failed to post record in quotation ', result)
    }
  }

  const imagehandleChange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Update the last item in the quotation items array with the image data
        setQuotation(prev => {
          const newItems = [...prev.items]
          newItems[newItems.length - 1].image = reader.result
          console.log('Image URL:', newItems)
          setShowimagename(false)
          return { ...prev, items: newItems }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      {rightread && (
        <div className='p-2 max-w-5xl mx-auto bg-white  rounded-xl mb-5 '>
          <div className='flex flex-col md:flex-row md:justify-between items-center mb-4 space-y-3 md:space-y-0'>
            <div className='w-full md:w-auto flex justify-start'>
              <button
                onClick={() => router.push('/dashboard')}
                className='flex items-center print:hidden gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition'
              >
                <House className='w-5 h-5' />
                Home
              </button>
            </div>

            <div className='text-center w-full'>
              <h1 className='text-2xl md:text-3xl font-bold'>
                Antica Ceramica
              </h1>
              <p className='text-sm md:text-base'>
                40 Raja Garden, New Delhi 110015 | GSTIN: 07ABUFA8367K1ZL
              </p>
              <h2 className='text-lg md:text-xl font-semibold underline'>
                Quotation
              </h2>
            </div>

            <div className='w-full md:w-auto flex justify-end space-x-2 print:hidden'>
              <button
                onClick={printPage}
                className='px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600'
              >
                Download
              </button>
              <button
                onClick={() => setShowClientModal(true)}
                className='px-4 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600'
              >
                Client Info
              </button>
              <button
                onClick={() => setShowCharges(true)}
                className='px-4 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600'
              >
                Charges
              </button>
            </div>
          </div>

          {/* <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center print:hidden gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <House className="w-5 h-5" />
              Home
            </button>

            <div className="text-center w-full">
              <h1 className="text-3xl font-bold">Antica Ceramica</h1>
              <p>40 Raja Garden, New Delhi 110015 | GSTIN: 07ABUFA8367K1ZL</p>
              <h2 className="text-xl font-semibold underline">Quotation</h2>
            </div>
            <div className=" flex space-x-2 print:hidden">
              <button
                onClick={printPage}
                className="px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Download
              </button>
              <button
                onClick={() => setShowClientModal(true)}
                className="px-4 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
              >
                Client Info
              </button>
              <button
                onClick={() => setShowCharges(true)}
                className="px-4 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
              >
                Charges
              </button>
            </div>
          </div> */}
          {/* // Edit Client & Order Info Modal */}
          {showClientModal && (
            <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2'>
              <div className='bg-white rounded-xl w-full max-w-3xl shadow-xl max-h-screen overflow-y-auto'>
                <div className='p-4 sm:p-6'>
                  <h2 className='text-lg font-semibold mb-4'>
                    Edit Client & Order Info
                  </h2>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    {/* Client Name */}
                    <div>
                      <label>Client Name</label>
                      <input
                        type='text'
                        className='border w-full px-2 py-1'
                        value={quotation.clientName}
                        onChange={e =>
                          setQuotation({
                            ...quotation,
                            clientName: e.target.value
                          })
                        }
                      />
                    </div>

                    {/* Order ID & Date */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                      <div>
                        <label>Order ID</label>
                        <input
                          type='text'
                          className='border w-full px-2 py-1'
                          value={quotation.orderId}
                          onChange={e =>
                            setQuotation({
                              ...quotation,
                              orderId: e.target.value
                            })
                          }
                        />
                      </div>
                      <div>
                        <label>Date</label>
                        <input
                          type='date'
                          className='border w-full px-2 py-1'
                          value={quotation.date}
                          onChange={e =>
                            setQuotation({ ...quotation, date: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label>Company Name</label>
                      <input
                        type='text'
                        className='border w-full px-2 py-1'
                        value={quotation.companyName}
                        onChange={e =>
                          setQuotation({
                            ...quotation,
                            companyName: e.target.value
                          })
                        }
                      />
                    </div>

                    {/* GSTIN & Sale Person */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                      <div>
                        <label>GSTIN</label>
                        <input
                          type='text'
                          className='border w-full px-2 py-1'
                          value={quotation.gst}
                          onChange={e =>
                            setQuotation({ ...quotation, gst: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label>Sale Person</label>
                        <input
                          type='text'
                          className='border w-full px-2 py-1'
                          value={quotation.saleperson}
                          onChange={e =>
                            setQuotation({
                              ...quotation,
                              saleperson: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Billing & Shipping Address */}
                    <div>
                      <label>Billing Address</label>
                      <textarea
                        className='border w-full px-2 py-2 resize-none'
                        rows={3}
                        value={quotation.billingAddress}
                        onChange={e =>
                          setQuotation({
                            ...quotation,
                            billingAddress: e.target.value
                          })
                        }
                      />
                    </div>
                    <div>
                      <label>Shipping Address</label>
                      <textarea
                        className='border w-full px-2 py-2 resize-none'
                        rows={3}
                        value={quotation.shippingAddress}
                        onChange={e =>
                          setQuotation({
                            ...quotation,
                            shippingAddress: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className='text-right mt-4'>
                    <button
                      onClick={() => setShowClientModal(false)}
                      className='bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 mr-2'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowClientModal(false)}
                      className='bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Client , Ord ID & Date */}
          <table className='w-full text-sm border border-gray-300 mb-4'>
            <tbody>
              <tr className='border-b border-gray-300'>
                <td className='p-2 font-semibold '>Client:</td>
                <td className='p-2'>{quotation.clientName}</td>
                <td className='p-2 font-semibold '>Order ID:</td>
                <td className='p-2'>{quotation.orderId}</td>
                <td className='p-2 font-semibold'>Date:</td>
                <td className='p-2'>{quotation.date}</td>
              </tr>
              <tr className='border-b border-gray-300'>
                <td className='p-2 font-semibold'>Company:</td>
                <td className='p-2'>{quotation.companyName}</td>
                <td className='p-2 font-semibold'>GSTIN:</td>
                <td className='p-2'>{quotation.gst}</td>
                <td className='p-2 font-semibold'>Salesperson:</td>
                <td className='p-2'>{quotation.saleperson}</td>
              </tr>
              <tr className='border-b border-gray-300 align-top'>
                <td className='p-2 font-semibold'>Billing Address:</td>
                <td className='p-2' colSpan={3}>
                  {quotation.billingAddress}
                </td>
                <td className='p-2 font-semibold'>Shipping Address:</td>
                <td className='p-2' colSpan={3}>
                  {quotation.shippingAddress}
                </td>
              </tr>
              <tr></tr>
            </tbody>
          </table>

          {/* Table Detail */}
          <table className='w-full text-sm border border-gray-300'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='border px-2 py-1'>S.No</th>
                <th className='border px-2 py-1'>Description</th>
                <th className='border px-2 py-1'>Size</th>
                <th className='border px-2 py-1'>Qty/Sqft</th>
                <th className='border px-2 py-1'>Qty/Box</th>
                <th className='border px-2 py-1'>Price</th>
                <th className='border px-2 py-1'>Amount</th>
                <th className='border px-2 py-1 print:hidden'>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={index}>
                  <td className='border px-2 py-1 text-center'>{index + 1}</td>

                  <td className='border '>
                    <div className='flex justify-between max-w-70'>
                      <input
                        className='w-[80%]  text-sm'
                        value={item.description}
                        onChange={e =>
                          handleItemChange(index, 'description', e.target.value)
                        }
                        placeholder='Description'
                      />

                      {showimagename && (
                        <input
                          type='file'
                          accept='image/*'
                          onChange={imagehandleChange}
                          className='w-[30%]  text-gray-700'
                        />
                      )}

                      {item.image && (
                        <img
                          src={item.image}
                          alt='Item'
                          className='w-18 h-18 justify-end border rounded'
                        />
                      )}
                    </div>
                  </td>

                  <td className='border px-2 py-1 max-w-20 '>
                    <input
                      className='w-full  px-1 text-center '
                      value={item.size}
                      onChange={e =>
                        handleItemChange(index, 'size', e.target.value)
                      }
                    />
                  </td>
                  <td className='border px-2 py-1 max-w-15'>
                    <input
                      type='number'
                      className='w-full  px-1 text-center'
                      value={item.qtypersqft}
                      onChange={e =>
                        handleItemChange(index, 'qtypersqft', e.target.value)
                      }
                    />
                  </td>
                  <td className='border px-2 py-1 max-w-15'>
                    <input
                      type='number'
                      className='w-full  px-1 text-center'
                      value={item.qtyperbox}
                      onChange={e =>
                        handleItemChange(index, 'qtyperbox', e.target.value)
                      }
                    />
                  </td>

                  <td className='border px-2 py-1 max-w-20'>
                    <input
                      type='number'
                      className='w-full px-1 text-center'
                      value={item.price}
                      onChange={e =>
                        handleItemChange(index, 'price', e.target.value)
                      }
                    />
                  </td>
                  <td className='border px-2 py-1  text-right'>
                    ₹{(item.qtypersqft * item.price).toFixed(2)}
                  </td>
                  <td className='border px-2 py-1 text-center max-w-2  print:hidden '>
                    <button
                      className='text-red-500 '
                      onClick={() => deleteItem(index)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addItem}
            className='mt-2 px-4 py-1 border rounded print:hidden hover:bg-gray-100'
          >
            + Add Item
          </button>
          <div className='mt-4 flex justify-between'>
            {/* Bank Detail Left Side */}

            <div className='text-left p-2  rounded-2xl '>
              <img
                src='/bank-bar-code.jpg'
                alt='Bank QR Code'
                width='100'
                height='100'
                className='float-right border-black ml-5 mt-4.5'
              />

              <table className='mt-2'>
                <thead>
                  <tr>
                    <th
                      colSpan={2}
                      className='text-left text-sm underline pb-1'
                    >
                      Bank Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bankDetail.map((record, index) => {
                    const key = Object.keys(record)[0]
                    const value = record[key]
                    return (
                      <tr key={index}>
                        <td className='pr-3 text-xs font-medium'>
                          {key.toUpperCase()} :
                        </td>
                        <td className='pr-3 text-xs'>{value}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Subtotal Right Side */}
            <div className=' text-sm text-right'>
              <div>Subtotal: ₹ {subtotal.toFixed(2)}</div>
              {quotation.discount > 0 && (
                <div>
                  Discount ({quotation.discount}%): -₹{discountAmt.toFixed(2)}
                </div>
              )}
              {quotation.gstRate > 0 && (
                <div>
                  GST ({quotation.gstRate}%): ₹{gstAmt.toFixed(2)}
                </div>
              )}
              {quotation.cuttingCharges > 0 && (
                <div>Cutting Charges: ₹{quotation.cuttingCharges}</div>
              )}
              {quotation.cartageCharges > 0 && (
                <div>Cartage Charges: ₹{quotation.cartageCharges}</div>
              )}
              {quotation.packingCharges > 0 && (
                <div>Packing Charges: ₹{quotation.packingCharges}</div>
              )}
              <div className='text-lg font-bold'>
                Grand Total: ₹{grandTotal.toFixed(2)}
              </div>
              <div className='text-lg font-bold'>
                {/* <p>{"Amount :- "}{converter.toWords(grandTotal.toFixed(2))}</p> */}
              </div>
            </div>
          </div>
          <div className='my-2'>
            <table>
              <thead>
                <tr>
                  <th className='text-left underline'>Term Condition</th>
                </tr>
              </thead>
              <tbody>
                {termcondition.map((field, i) => (
                  <tr key={i}>
                    <td className='text-xs py-0.2 pl-3 flex'>
                      {'* '}
                      {field}{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='print:hidden mb-5 text-right'>
            <button
              className='bg-green-500 rounded-2xl py-2 px-10 mr-2 w-60 hover:bg-green-600 text-black'
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          {showCharges && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white p-6 rounded-lg shadow-md w-96'>
                <h3 className='text-lg font-semibold mb-4'>Enter Charges</h3>
                <div className='space-y-3'>
                  <div>
                    <label>Discount (%)</label>
                    <input
                      type='number'
                      className='border w-full px-2 py-1 '
                      value={quotation.discount}
                      onChange={e =>
                        setQuotation({ ...quotation, discount: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>GST Rate (%)</label>
                    <input
                      type='number'
                      className='border w-full px-2 py-1'
                      value={quotation.gstRate}
                      onChange={e =>
                        setQuotation({ ...quotation, gstRate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Cutting Charges</label>
                    <input
                      type='number'
                      className='border w-full px-2 py-1'
                      value={quotation.cuttingCharges}
                      onChange={e =>
                        setQuotation({
                          ...quotation,
                          cuttingCharges: e.target.value
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Cartage Charges</label>
                    <input
                      type='number'
                      className='border w-full px-2 py-1'
                      value={quotation.cartageCharges}
                      onChange={e =>
                        setQuotation({
                          ...quotation,
                          cartageCharges: e.target.value
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Packing Charges</label>
                    <input
                      type='number'
                      className='border w-full px-2 py-1'
                      value={quotation.packingCharges}
                      onChange={e =>
                        setQuotation({
                          ...quotation,
                          packingCharges: e.target.value
                        })
                      }
                    />
                  </div>
                </div>
                <div className='text-right mt-4'>
                  <button
                    onClick={() => setShowCharges(false)}
                    className='px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
