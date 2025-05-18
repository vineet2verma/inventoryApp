"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { House, Pencil, Trash } from "lucide-react";

export default function StockTableItemDetailPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOutModal, setisOutModal] = useState(false)
  const [itemid, setitemid] = useState("");
  const [inputval, setinputval] = useState("")

  const fetchRecords = async () => {
    const res = await fetch("/api/itemdetail");
    const data = await res.json();
    setRecords(data);
    setFilteredRecords(data); // Initialize filtered records
  };

  const item_tag_update = async (id, action, remarks) => {

    // console.log(id, action)

    if (action == "default") {
      setitemid(id);
      setisOutModal(true)
    }
    if (action == "Out" || action == "Cancel") {

      const res = await fetch("/api/itemdetail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemid, action, remarks }),
      });

      let data = await res.json();
      if (data.sucess) {
        fetchRecords();
        setisOutModal(false)
      }
    }
  }

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
    // "ordid",
    // "name",
    "designname",
    "coname",
    "batchno",
    "size",
    "qty",
    "outtag",
    "remarks"
  ];

  return (
    <div className="p-0">
      {/* Head */}
      <div className="sticky top-0 flex justify-between items-center mb-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <House className="w-5 h-5" />
          Home
        </button>
        <h1 className="text-2xl mb-4  text-center font-bold">Stock Items </h1>
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

          {/* <button
            onClick={openAddModal}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-120  bg-white rounded shadow">
        <table className="w-full text-sm  ">
          <thead className="sticky top-0 bg-gray-300 text-left z-10">
            <tr>
              <th className="p-3">#</th>
              {fields.map((field) => (
                <th key={field} className="p-3 capitalize">
                  {field}
                </th>
              ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                {fields.map((field) =>
                  field != "outtag" ? (
                    <td key={field} className="p-3">
                      {record[field]}
                    </td>
                  ) : (
                    <td key={field} className="p-3">

                      <button
                        onClick={() => {
                          item_tag_update(record._id, "default", "")
                          // alert(record._id);
                        }}

                        className={`${record[field] == "Out"
                          ? "bg-green-300"
                          : "bg-yellow-300"
                          } min-w-12  py-1 px-2 rounded-2xl `}
                      >
                        {record[field]}
                      </button>
                    </td>
                  )
                )}
                <td className="flex p-3 space-x-2">

                  {/* <button
                    onClick={() => openEditModal(record)}
                    className="p-1 text-green-600 rounded hover:bg-yellow-600"
                  >
                    <Pencil />
                  </button> */}
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

      {/* //////////////////////////////// */}
      {/* Modal Form For Item Hold / Out / Cancel */}
      {isOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {"Stock Out : Details"}
            </h2>

            <div className="grid grid-cols-2 gap-x-5 py-2">

              <button
                className="border-1 py-5 rounded-2xl bg-red-500"
                onClick={() => { item_tag_update(records._id, "Cancel") }}
              >
                Cancel
              </button>

              <button
                className="border-1 rounded-2xl bg-green-400"
                onClick={() => { item_tag_update(records._id, "Out",) }}
              >
                Out
              </button>
            </div>
            <div className="my-2">
              <lable>Reason</lable>
              <input
                type="text"
                name="itemremarks"
                value={inputval}
                onChange={(e) => { setinputval(e.target.value) }}
                placeholder="Reason"
                className="p-2 py-4 border-1 rounded w-full"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setisOutModal(false)}
                className="py-2 px-10 border-1 rounded-2xl bg-red-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* /////////////////////////////////////// */}


      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEditMode ? "Update Dealer Stock" : "Add Dealer Stock"}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {fields.map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 capitalize"
                  >
                    {field
                      .replace(/([a-z])([A-Z])/g, "$1 $2")
                      .replace(/_/g, " ")}
                  </label>
                  {field === "date" ? (
                    <input
                      type="date"
                      id={field}
                      name={field}
                      placeholder={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      className="p-2 border rounded w-full"
                    />
                  ) : field == "outtag" ? (
                    <select
                      className="p-2 border rounded w-full"
                      onChange={handleChange}
                      name={field}
                      value={formData[field] || ""}
                    >
                      <option value="Hold">Hold</option>
                      <option value="Out">Out</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  ) : (
                    <input
                      id={field}
                      name={field}
                      placeholder={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      className="p-2 border rounded w-full"
                    />
                  )}
                </div>
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
