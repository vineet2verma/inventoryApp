'use client';
import { Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CRMClientPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    salesperson: '',
    followupstage: '',
    nextfollowdate: '',
    search: '',
  });

  const columns = [
    'date', 'name', 'mobile', 'querytype', 'remarks',
    'salesperson', 'nextfollowdate', 'followupstage', 'referencetype',
  ];

  const fetchData = async () => {
    const res = await fetch('/api/crmclient');
    const json = await res.json();
    if (json.success) setData(json.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...form, _id: editingId } : form;

    const res = await fetch('/api/crmclient', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm({});
      setEditingId(null);
      setShowForm(false);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/crmclient?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleCancel = () => {
    setForm({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = data.filter((item) => {
    return (
      item.salesperson?.toLowerCase().includes(filters.salesperson.toLowerCase()) &&
      item.followupstage?.toLowerCase().includes(filters.followupstage.toLowerCase()) &&
      item.nextfollowdate?.toLowerCase().includes(filters.nextfollowdate.toLowerCase()) &&
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(filters.search.toLowerCase())
      )
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CRM Client Master</h1>
        <button
          onClick={() => {
            setForm({});
            setShowForm(true);
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create New
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          name="search"
          placeholder="Search all..."
          value={filters.search}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="salesperson"
          placeholder="Filter by Salesperson"
          value={filters.salesperson}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="followupstage"
          placeholder="Filter by Followup Stage"
          value={filters.followupstage}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="nextfollowdate"
          placeholder="Filter by Next Follow Date"
          value={filters.nextfollowdate}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col} className="border px-3 py-2 text-left">
                  {col.toUpperCase()}
                </th>
              ))}
              <th className="border px-3 py-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-2">
                      {item[col] || ''}
                    </td>
                  ))}
                  <td className="border px-3 py-2 space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl relative">
            <button onClick={handleCancel} className="absolute top-2 right-2 text-gray-500">
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columns.map((col) => (
                <div key={col} className="flex flex-col">
                  <label className="mb-1 text-sm font-medium capitalize">{col}</label>
                  <input
                    name={col}
                    value={form[col] || ''}
                    onChange={handleChange}
                    className="p-2 border rounded"
                  />
                </div>
              ))}
              <div className="col-span-full flex justify-end gap-3 mt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
