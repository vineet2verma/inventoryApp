"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { House } from "lucide-react";
import moment from "moment";

export default function StockTableItemDetailPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOuttag, setFilterOuttag] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [filterMidname, setFilterMidname] = useState("");
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOutModal, setisOutModal] = useState(false);
  const [itemid, setitemid] = useState("");
  const [inputval, setinputval] = useState("");

  const fetchRecords = async () => {
    const res = await fetch("/api/itemdetail");
    const data = await res.json();
    setRecords(data);
    setFilteredRecords(data);
  };

  const item_tag_update = async (id, action) => {
    if (action === "default") {
      setitemid(id);
      setisOutModal(true);
    }
    if (action === "Out" || action === "Cancel") {
      const res = await fetch("/api/itemdetail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemid, action, remarks: inputval }),
      });

      let data = await res.json();
      if (data.sucess) {
        fetchRecords();
        setisOutModal(false);
      }
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filtered = records.filter((record) => {
      const matchesSearch = Object.values(record).some((value) =>
        String(value).toLowerCase().includes(query)
      );

      const matchesOuttag =
        !filterOuttag || record.outtag?.toLowerCase() === filterOuttag.toLowerCase();

      const matchesSize =
        !filterSize || record.size?.toLowerCase() === filterSize.toLowerCase();

      const matchesMidname =
        !filterMidname || record.midname?.toLowerCase() === filterMidname.toLowerCase();

      return matchesSearch && matchesOuttag && matchesSize && matchesMidname;
    });

    setFilteredRecords(filtered);
  }, [searchQuery, filterOuttag, filterSize, filterMidname, records]);

  const fields = [
    "date",
    "mid",
    "midname",
    "designname",
    "coname",
    "batchno",
    "size",
    "qty",
    "outtag",
    "remarks",
    "updatedAt",
  ];

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* Header & Filters */}
      <div className="sticky top-0 flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <House className="w-5 h-5" />
            Home
          </button>
          <h1 className="text-xl sm:text-2xl font-bold ml-4 sm:ml-6">Stock Items</h1>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4 sm:mt-0">
          <select
            value={filterOuttag}
            onChange={(e) => setFilterOuttag(e.target.value)}
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
          >
            <option value="">All Outtags</option>
            <option value="Hold">Hold</option>
            <option value="Out">Out</option>
            <option value="Cancel">Cancel</option>
          </select>

          <select
            value={filterSize}
            onChange={(e) => setFilterSize(e.target.value)}
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
          >
            <option value="">All Sizes</option>
            {[...new Set(records.map((r) => r.size))].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select
            value={filterMidname}
            onChange={(e) => setFilterMidname(e.target.value)}
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
          >
            <option value="">All Midnames</option>
            {[...new Set(records.map((r) => r.midname))].map((mid) => (
              <option key={mid} value={mid}>
                {mid}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-2 sm:p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-gray-400 sticky top-0">
            <tr>
              <th className="p-2">#</th>
              {fields.map((field) => (
                <th key={field} className="p-2 capitalize whitespace-nowrap">
                  {field === "updatedAt" ? "Action Date" : field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="p-2 whitespace-nowrap">{index + 1}</td>
                {fields.map((field) =>
                  field === "updatedAt" ? (
                    <td key={field} className="p-2 whitespace-nowrap">
                      {moment(record[field]).format("DD-MM-YYYY")}
                    </td>
                  ) : field !== "outtag" ? (
                    <td key={field} className="p-2 whitespace-nowrap">
                      {record[field]}
                    </td>
                  ) : (
                    <td key={field} className="p-2 whitespace-nowrap">
                      <button
                        onClick={() => item_tag_update(record._id, "default")}
                        className={`${
                          record[field] === "Out"
                            ? "bg-green-300"
                            : "bg-yellow-300"
                        } min-w-12 py-1 px-2 rounded-2xl`}
                      >
                        {record[field]}
                      </button>
                    </td>
                  )
                )}
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td
                  colSpan={fields.length + 1}
                  className="p-2 text-center text-gray-500"
                >
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
