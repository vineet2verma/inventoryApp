'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Pencil, Trash2, PlusCircle, House, Link, Plus } from "lucide-react";

export default function PriceListPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/pricelist');
    const json = await res.json();
    setData(json);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (item = {}) => {
    setFormData(item);
    setEditId(item._id || null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/pricelist?id=${editId}` : '/api/pricelist';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({});
    setEditId(null);
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await fetch('/api/pricelist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const filteredData = data.filter((item) =>
    ['designName', 'coName', 'size', 'type'].some((key) =>
      item[key]?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <House className="w-5 h-5" />
          Home
        </button>
        <h1 className="text-3xl font-bold">Price List</h1>
        <div className="mb-4 flex justify-between flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search by any field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full sm:w-64"
          />
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Entry
          </button>
        </div>

      </div>






      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border shadow-md rounded">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              {[
                'Date',
                'Design Name',
                'Company Name',
                'Size',
                'Rate/Box',
                'Qty/Box',
                'Packing',
                'Type',
                'Actions',
              ].map((header) => (
                <th key={header} className="px-4 py-2 border">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id} className="text-sm text-gray-800 border-t">
                <td className="px-4 py-2 border">{item.date}</td>
                <td className="px-4 py-2 border">{item.designName}</td>
                <td className="px-4 py-2 border">{item.coName}</td>
                <td className="px-4 py-2 border">{item.size}</td>
                <td className="px-4 py-2 border">{item.ratePerBox}</td>
                <td className="px-4 py-2 border">{item.qtyPerBox}</td>
                <td className="px-4 py-2 border">{item.packingPerBox}</td>
                <td className="px-4 py-2 border">{item.type}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => openModal(item)}
                    className="bg-yellow-400 px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? 'Update Entry' : 'Add Entry'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  value={formData[field] || ''}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded"
                />
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => {
                  setFormData({});
                  setEditId(null);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}