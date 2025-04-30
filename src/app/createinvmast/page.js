"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InventoryMaster() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const fetchRecords = async () => {
    const res = await fetch("/api/createinv");
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    await fetch("/api/createinv", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchRecords();
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { id: editingId, ...formData } : formData;

    await fetch("/api/createinv", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchRecords();
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
        <button
          onClick={handleAdd}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Inventory
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          {[
            "designName", "coName", "batchNo", "type", "Size", "Weight",
            "pcPerBox", "Location", "opStock", "purPrice", "holdStock",
            "closingStock", "createdBy",
          ].map((field) => (
            <input
              key={field}
              required={field === "designName"}
              placeholder={field}
              value={formData[field] || ""}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="p-2 border rounded-xl"
            />
          ))}
          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
          >
            {editingId ? "Update Record" : "Create Record"}
          </button>
        </form>
      )}

      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Design</th>
              <th className="p-2">Company</th>
              <th className="p-2">Batch</th>
              <th className="p-2">Type</th>
              <th className="p-2">Size</th>
              <th className="p-2">Weight</th>
              <th className="p-2">Pcs/Box</th>
              <th className="p-2">Location</th>
              <th className="p-2">Op. Stock</th>
              <th className="p-2">Pur. Price</th>
              <th className="p-2">Hold Stock</th>
              <th className="p-2">Closing</th>
              <th className="p-2">Created By</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id} className="border-t">
                <td className="p-2">{rec.designName}</td>
                <td className="p-2">{rec.coName}</td>
                <td className="p-2">{rec.batchNo}</td>
                <td className="p-2">{rec.type}</td>
                <td className="p-2">{rec.Size}</td>
                <td className="p-2">{rec.Weight}</td>
                <td className="p-2">{rec.pcPerBox}</td>
                <td className="p-2">{rec.Location}</td>
                <td className="p-2">{rec.opStock}</td>
                <td className="p-2">{rec.purPrice}</td>
                <td className="p-2">{rec.holdStock}</td>
                <td className="p-2">{rec.closingStock}</td>
                <td className="p-2">{rec.createdBy}</td>
                <td className="p-2 text-gray-500">
                  {new Date(rec.createdAt).toLocaleString()}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(rec)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rec._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={15} className="text-center p-4 text-gray-500">
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
