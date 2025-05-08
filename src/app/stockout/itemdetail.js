"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { House,Pencil,Trash } from "lucide-react";

export default function StockTableItemDetailPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchRecords = async () => {
    const res = await fetch("/api/itemdetail");
    const data = await res.json();
    setRecords(data);
    setFilteredRecords(data); // Initialize filtered records
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = records.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredRecords(filtered);
  };

  const openAddModal = () => {
    setFormData({});
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setFormData(record);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const method = isEditMode ? "PUT" : "POST";
    const res = await fetch("/api/itemdetail", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setIsModalOpen(false);
      fetchRecords();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    const res = await fetch("/api/itemdetail", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchRecords();
  };

  const fields = [
    "date",
    "mid",
    "midname",
    "ordid",
    "name",
    "designname",
    "coname",
    "batchno",
    "size",
    "qty",
    "salesperson",
    "discount",
    "price",
    "outtag",
    "currstock",
    "createdby",
  ];

  return (
    <div className="p-6">
      {/* Head */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <House className="w-5 h-5" />
          Home
        </button>
        <h1 className="text-2xl font-bold">Items Stock Detail</h1>
        <div className="flex mx-2">
          {/* Search Bar */}
          <div className="mb-4 mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search records..."
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={openAddModal}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              {fields.map((field) =>
                field !== "createdby" && field !== "mid" ? (
                  <th key={field} className="p-3 capitalize">
                    {field}
                  </th>
                ) : null
              )}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                {fields.map(
                  (field) =>
                    field !== "createdAt" &&
                    field !== "updatedAt" &&
                    field !== "createdby" && (
                      <td key={field} className="p-3">
                        {record[field]}
                      </td>
                    )
                )}
                <td className="flex p-3 space-x-2">
                  <button
                    onClick={() => openEditModal(record)}
                    className="p-1 text-green-600 rounded hover:bg-yellow-600"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="p-1 text-red-500 rounded hover:bg-red-700"
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td
                  colSpan={fields.length + 3}
                  className="p-4 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEditMode ? "Update Dealer Stock" : "Add Dealer Stock"}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {fields.map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="p-2 border rounded"
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
