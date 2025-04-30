"use client";
import { useState, useEffect } from "react";

export default function StockInPage() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    designName: "",
    coName: "",
    batchNo: "",
    type: "",
    size: "",
    weight: "",
    pcPerBox: "",
    location: "",
    purPrice: "",
    currStock: "",
    createdBy: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch records from the API
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/stockin");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = "/api/stockin";
    const body = editId ? { id: editId, ...formData } : formData;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      alert(result.message);
      setFormData({
        date: "",
        designName: "",
        coName: "",
        batchNo: "",
        type: "",
        size: "",
        weight: "",
        pcPerBox: "",
        location: "",
        purPrice: "",
        currStock: "",
        createdBy: "",
      });
      setEditId(null);
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      console.error("Failed to save record:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/stockin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      alert(result.message);
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const handleEdit = (record) => {
    setFormData({ ...record });
    setEditId(record._id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      date: "",
      designName: "",
      coName: "",
      batchNo: "",
      type: "",
      size: "",
      weight: "",
      pcPerBox: "",
      location: "",
      purPrice: "",
      currStock: "",
      createdBy: "",
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Stock-In Records</h1>

      <button
        onClick={handleAddNew}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Record
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Design Name</th>
              <th className="p-4 text-left">Company Name</th>
              <th className="p-4 text-left">Batch No</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Size</th>
              <th className="p-4 text-left">Weight</th>
              <th className="p-4 text-left">Pieces Per Box</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Purchase Price</th>
              <th className="p-4 text-left">Current Stock</th>
              <th className="p-4 text-left">Created By</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="border-t">
                <td className="p-4">{record.date}</td>
                <td className="p-4">{record.designName}</td>
                <td className="p-4">{record.coName}</td>
                <td className="p-4">{record.batchNo}</td>
                <td className="p-4">{record.type}</td>
                <td className="p-4">{record.size}</td>
                <td className="p-4">{record.weight}</td>
                <td className="p-4">{record.pcPerBox}</td>
                <td className="p-4">{record.location}</td>
                <td className="p-4">{record.purPrice}</td>
                <td className="p-4">{record.currStock}</td>
                <td className="p-4">{record.createdBy}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(record)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Record" : "Add New Record"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Date"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="designName"
                  value={formData.designName}
                  onChange={handleChange}
                  placeholder="Design Name"
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="coName"
                  value={formData.coName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="batchNo"
                  value={formData.batchNo}
                  onChange={handleChange}
                  placeholder="Batch No"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Type"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Size"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="pcPerBox"
                  value={formData.pcPerBox}
                  onChange={handleChange}
                  placeholder="Pieces Per Box"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="purPrice"
                  value={formData.purPrice}
                  onChange={handleChange}
                  placeholder="Purchase Price"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="currStock"
                  value={formData.currStock}
                  onChange={handleChange}
                  placeholder="Current Stock"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  placeholder="Created By"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editId ? "Update Record" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}