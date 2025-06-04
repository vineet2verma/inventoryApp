'use client';
import { useEffect, useState } from 'react';

export default function CRMClientPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const columns = [
    'oid', 'name', 'email', 'mobile', 'companyname', 'querytype',
    'remarks', 'leadtype', 'salesperson', 'parent', 'referencetype',
    'protentialvalue', 'nextfollowdate', 'followups', 'lastcontact', 'status',
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM Client Master</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create New
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <input
              key={col}
              name={col}
              value={form[col] || ''}
              onChange={handleChange}
              placeholder={col.charAt(0).toUpperCase() + col.slice(1)}
              className="p-2 border rounded"
            />
          ))}

          <div className="col-span-1 md:col-span-3 flex gap-3 mt-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col} className="border px-3 py-2 text-left whitespace-nowrap">
                  {col.toUpperCase()}
                </th>
              ))}
              <th className="border px-3 py-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-2 whitespace-nowrap">
                      {item[col] || ''}
                    </td>
                  ))}
                  <td className="border px-3 py-2 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
    </div>
  );
}
