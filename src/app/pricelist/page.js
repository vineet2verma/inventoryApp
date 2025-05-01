'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PriceListPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/price-list');
    const json = await res.json();
    setData(json);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/price-list?id=${editId}` : '/api/price-list';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({});
    setEditId(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/price-list?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item._id);
  };

  const filteredData = data.filter((item) =>
    item.designName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Price List</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Design Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

        {[
          'date',
          'designName',
          'coName',
          'size',
          'ratePerBox',
          'qtyPerBox',
          'packingPerBox',
          'type',
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={formData[field] || ''}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
          />
        ))}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Design</th>
              <th className="py-2 px-3">Company</th>
              <th className="py-2 px-3">Size</th>
              <th className="py-2 px-3">Rate</th>
              <th className="py-2 px-3">Qty</th>
              <th className="py-2 px-3">Packing</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="py-2 px-3">{item.date}</td>
                <td className="py-2 px-3">{item.designName}</td>
                <td className="py-2 px-3">{item.coName}</td>
                <td className="py-2 px-3">{item.size}</td>
                <td className="py-2 px-3">{item.ratePerBox}</td>
                <td className="py-2 px-3">{item.qtyPerBox}</td>
                <td className="py-2 px-3">{item.packingPerBox}</td>
                <td className="py-2 px-3">{item.type}</td>
                <td className="py-2 px-3 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
