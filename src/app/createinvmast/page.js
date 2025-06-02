'use client'
import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, House } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LoginUserFunc } from '../context/loginuser'
import { fetchTypeRecords } from '../components/fetchtypemast'
import { fetchlocationRecords } from '@/app/components/fetchlocationmast'

export default function InventoryMaster () {
  const { user } = LoginUserFunc()
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [locationList, setLocationList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [mainfilterbackup, setmainfilterbackup] = useState([])
  const [showLocations, setShowLocations] = useState(false)
  const router = useRouter()
  const [rightread, setrightread] = useState(false)
  const [rightcreate, setrightcreate] = useState(false)
  const [rightedit, setrightedit] = useState(false)
  const [rightdelete, setrightdelete] = useState(false)

  const fetchRecords = async () => {
    const res = await fetch('/api/createinvmast')
    const data = await res.json()
    setRecords(data)
    setFilteredRecords(data)
    setmainfilterbackup(data)
  }

  const fetchTypeList = async () => {
    const typelist = await fetchTypeRecords()
    setTypeList(typelist)
  }

  const fetchLocationMast = async () => {
    const locationList = await fetchlocationRecords()
    setLocationList(locationList)
  }

  useEffect(() => {
    fetchRecords()
    fetchTypeList()
    fetchLocationMast()
  }, [])

  useEffect(() => {
    setrightread(user.user?.pinventory.includes('read'))
    setrightcreate(user.user?.pinventory.includes('create'))
    setrightedit(user.user?.pinventory.includes('update'))
    setrightdelete(user.user?.pinventory.includes('delete'))
  }, [user])

  const handleDelete = async (id, designname) => {
    if (prompt('Enter Design Name').toLowerCase() == designname.toLowerCase()) {
      await fetch('/api/createinvmast', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      alert('Record Was Deleted ')
      fetchRecords()
    }
  }

  const handleEdit = record => {
    const locationArray = record.location?.split(',').filter(Boolean) || []
    setFormData({
      ...record,
      location: Array.from(new Set(locationArray.map(e => e.trim())))
    })
    setEditingId(record._id)
    setShowForm(true)
  }

  const handleAdd = () => {
    setFormData({})
    setEditingId(null)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const body = editingId ? { id: editingId, ...formData } : { ...formData }
    body.location = Array.isArray(formData.location)
      ? formData.location.join(',')
      : formData.location || ''

    await fetch('/api/createinvmast', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    fetchRecords()
    setShowForm(false)
    setFormData({})
    setEditingId(null)
  }

  const handleSearch = async e => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query === '') {
      setFilteredRecords(mainfilterbackup)
    } else {
      const req = await fetch('/api/searchinvmastpage?query=' + query)
      const res = await req.json()
      setmainfilterbackup(res.data)
      setFilteredRecords(res.data)
    }
  }

  const handleTypeSearch = e => {
    const value = e.target.value
    if (value !== '') {
      const filtered = mainfilterbackup.filter(item => item.type === value)
      setFilteredRecords(filtered)
    } else {
      setFilteredRecords(mainfilterbackup)
    }
  }

  const handleSizeSearch = e => {
    const value = e.target.value
    if (value !== '') {
      const filtered = mainfilterbackup.filter(item => item.size === value)
      setFilteredRecords(filtered)
    } else {
      setFilteredRecords(mainfilterbackup)
    }
  }

  return (
    <>
      {rightread && (
        <div className='max-h-screen p-4 bg-gray-100'>
          <div className='sticky top-0 flex flex-wrap justify-between items-center mb-4 gap-2'>
            <button
              onClick={() => router.push('/dashboard')}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition'
            >
              <House className='w-5 h-5' />
              Home
            </button>

            <div className='flex flex-wrap items-center gap-2'>
              <select
                className='border rounded-full px-4 py-2'
                onChange={handleTypeSearch}
              >
                <option value=''>Select Type</option>
                <option>Regular</option>
                <option>Discontinue</option>
                <option>On Order</option>
              </select>

              <select
                className='rounded-full border px-4 py-2'
                onChange={handleSizeSearch}
              >
                <option value=''>Select Size</option>
                {Array.from(new Set(mainfilterbackup.map(x => x.size))).map(
                  (item, i) => (
                    <option key={i}>{item}</option>
                  )
                )}
              </select>

              <input
                type='text'
                value={searchQuery}
                onChange={handleSearch}
                placeholder='Search'
                className='w-full sm:w-auto px-4 py-2 border rounded-full'
              />

              {rightcreate && (
                <button
                  onClick={showForm ? handleCancel : handleAdd}
                  className={
                    showForm
                      ? 'flex items-center bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700'
                      : 'flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700'
                  }
                >
                  <Plus className='w-4 h-4 mr-2' />
                  {showForm ? 'Cancel' : 'Add Inventory'}
                </button>
              )}
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className='bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4'
            >
              {[
                'designname',
                'coname',
                'batchno',
                'type',
                'size',
                'weight',
                'pcperbox',
                'minqty',
                'maxqty',
                'opstock',
                'holdstock',
                'location'
              ].map(field => {
                const label = field
                  .replace('pcperbox', 'Pcs per Box')
                  .replace('opstock', 'Opening Stock')
                  .replace('holdstock', 'Hold Stock')
                  .replace('minqty', 'Min Qty')
                  .replace('maxqty', 'Max Qty')
                  .replace('batchno', 'Batch No')
                  .replace('coname', 'Company Name')
                  .replace('designname', 'Design Name')
                  .replace('type', 'Type')
                  .replace('size', 'Size')
                  .replace('weight', 'Weight')
                  .replace('location', 'Location')

                if (field === 'type') {
                  return (
                    <div key={field}>
                      <label className='text-xs'>{label}</label>
                      <select
                        value={formData[field] || ''}
                        onChange={e =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className='p-2 border rounded-xl w-full'
                      >
                        <option value='' disabled>
                          Select {label}
                        </option>
                        {typeList.map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                } else if (field === 'location') {
                  return (
                    <div key={field} className='border rounded-xl p-2'>
                      {/* <label className="block text-xs">
                        Select {label}(s):
                      </label> */}
                      <button
                        type='button'
                        onClick={() => setShowLocations(prev => !prev)}
                        className='text-blue-600 underline block'
                      >
                        {showLocations ? 'Hide Locations' : 'Select Locations'}
                      </button>
                      {showLocations && (
                        <div className='grid gap-2 max-h-40 overflow-y-auto'>
                          {locationList.map((loc, i) => (
                            <label key={i} className='block'>
                              <input
                                type='checkbox'
                                checked={(formData.location || []).includes(
                                  loc
                                )}
                                onChange={e => {
                                  const selected = Array.isArray(
                                    formData.location
                                  )
                                    ? formData.location
                                    : formData.location
                                        ?.split(',')
                                        .filter(Boolean) || []
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      location: [...new Set([...selected, loc])]
                                    })
                                  } else {
                                    setFormData({
                                      ...formData,
                                      location: selected.filter(
                                        item => item !== loc
                                      )
                                    })
                                  }
                                }}
                                className='mr-2'
                              />
                              {loc}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                } else {
                  const isNumber = [
                    'batchno',
                    'weight',
                    'pcperbox',
                    'minqty',
                    'maxqty',
                    'opstock',
                    'holdstock'
                  ].includes(field)

                  return (
                    <div key={field}>
                      <label className='text-xs'>{label}</label>
                      <input
                        type={isNumber ? 'number' : 'text'}
                        placeholder={label}
                        required
                        value={formData[field] || ''}
                        onChange={e =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className='p-2 border rounded-xl w-full'
                      />
                    </div>
                  )
                }
              })}

              <button
                type='submit'
                className='col-span-1 sm:col-span-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700'
              >
                {editingId ? 'Update Record' : 'Create Record'}
              </button>
            </form>
          )}

          <div className='bg-white p-0 rounded-xl shadow-md overflow-x-auto overflow-y-auto top-0 max-h-130 '>
            <table className='min-w-full text-sm text-left table-auto'>
              <thead className='bg-gray-400 sticky top-0'>
                <tr>
                  <th className='p-2'>Design</th>
                  <th className='p-2'>Company</th>
                  <th className='p-2'>Batch</th>
                  <th className='p-2'>Size</th>
                  <th className='p-2'>Type</th>
                  <th className='p-2'>Weight</th>
                  <th className='p-2'>Pcs/Box</th>
                  <th className='p-2'>Location</th>
                  <th className='p-2'>Min. Qty</th>
                  <th className='p-2'>Max. Qty</th>
                  <th className='p-2'>Op. Stock</th>
                  <th className='p-2'>Hold Stock</th>
                  <th className='p-2'>Cl. Stock</th>
                  <th className='p-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(rec => (
                  <tr key={rec._id} className='border-t'>
                    <td className='p-2'>{rec.designname}</td>
                    <td className='p-2'>{rec.coname}</td>
                    <td className='p-2'>{rec.batchno}</td>
                    <td className='p-2'>{rec.size}</td>
                    <td className='p-2'>{rec.type}</td>
                    <td className='p-2'>{rec.weight}</td>
                    <td className='p-2'>{rec.pcperbox}</td>
                    <td className='p-2'>{rec.location}</td>
                    <td
                      className={`p-2 ${
                        parseFloat(rec.closingstock) <= parseFloat(rec.minqty)
                          ? 'bg-amber-300'
                          : ''
                      }`}
                    >
                      {rec.minqty}
                    </td>
                    <td
                      className={`p-2 ${
                        parseFloat(rec.closingstock) >= parseFloat(rec.maxqty)
                          ? 'bg-orange-300'
                          : ''
                      }`}
                    >
                      {rec.maxqty}
                    </td>
                    <td className='p-2'>{rec.opstock}</td>
                    <td className='p-2'>{rec.holdstock}</td>
                    <td className='p-2'>{rec.closingstock}</td>
                    <td className='p-2 space-x-2'>
                      {rightedit && (
                        <button
                          onClick={() => handleEdit(rec)}
                          className='text-blue-600 hover:text-blue-800'
                        >
                          <Pencil className='w-4 h-4' />
                        </button>
                      )}
                      {rightdelete && (
                        <button
                          onClick={() => handleDelete(rec._id, rec.designname)}
                          className='text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={14} className='text-center p-4 text-gray-500'>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
