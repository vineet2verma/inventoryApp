"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Pencil, Trash2, PlusCircle, House, Link, Plus } from "lucide-react";
import { useRouter } from "next/navigation";



export default function DealerMastPage() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    delId: "",
    delName: "",
    coName: "",
    gstNo: "",
    contPerson: "",
    contactNo: "",
    mobWhatsApp: "",
    address: "",
    state: "",
    paymentType: "",
    refBy: "",
    remarks: "",
    delRating: "",
    discount: "",
    delLimit: "",
    delSalesMan: "",
    delStatus: "",
    createdBy: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Fetch records from the API
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/dealermast");
      const data = await res.json();
      setRecords(data);
      setFilteredRecords(data); // Initialize filtered records
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = "/api/dealermast";
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
        delId: "",
        delName: "",
        coName: "",
        gstNo: "",
        contPerson: "",
        contactNo: "",
        mobWhatsApp: "",
        address: "",
        state: "",
        paymentType: "",
        refBy: "",
        remarks: "",
        delRating: "",
        discount: "",
        delLimit: "",
        delSalesMan: "",
        delStatus: "",
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
      const res = await fetch("/api/dealermast", {
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
      delId: "",
      delName: "",
      coName: "",
      gstNo: "",
      contPerson: "",
      contactNo: "",
      mobWhatsApp: "",
      address: "",
      state: "",
      paymentType: "",
      refBy: "",
      remarks: "",
      delRating: "",
      discount: "",
      delLimit: "",
      delSalesMan: "",
      delStatus: "",
      createdBy: "",
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4  bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <House className="w-5 h-5" />
          Home
        </button>
        <h1 className="text-2xl font-bold text-center mb-4">Dealer Mast Records</h1>

        <div className="flex px-2 items-center mb-6 ">
          {/* Search Bar */}
          <div className="mb-4 pr-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search records..."
              className="border p-2 rounded w-full text-sm"
            />
          </div>
          <button
            onClick={handleAddNew}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Record
          </button>
        </div>

      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow-md text-sm">
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(formData).map((key) => (
                <th key={key} className="p-2 text-left capitalize">
                  {key}
                </th>
              ))}
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record._id} className="border-t">
                {Object.keys(formData).map((key) => (
                  <td key={key} className="p-2">
                    {record[key]}
                  </td>
                ))}
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
          <div className="bg-white p-4 rounded shadow-md w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Edit Record" : "Add New Record"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(formData).map((key) =>
                key=="date"?
                (
                  <input
                    key={key}
                    type="date"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={key}
                    className="border p-2 rounded w-full text-sm"
                  />
                )
                : key=="contactNo" || key=="mobWhatsApp" || key=="delLimit" || key=="delRating" || key=="discount" ?(
                  <input
                    key={key}
                    type="number"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={key + "...."}
                    className="border p-2 rounded w-full text-sm"
                  />
                ) : key =="delStatus"?(
                  <select
                    key={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="border p-2 rounded w-full text-sm"
                  >
                    <option key="Active" value="Active">Active</option>
                    <option key="Inactive" value="Inactive">Inactive</option>
                  </select>
                ) : key=="_id" || key=="delId"  || key=="createdAt" || key=="updatedAt" || key=="__v" ? '' :
                (                 
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={key}
                    className="border p-2 rounded w-full text-sm"
                  />
                ))}
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