"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { House } from "lucide-react";
import moment from "moment";

export default function StockTableItemDetailPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOutModal, setisOutModal] = useState(false);

  const [filterDate, setFilterDate] = useState("");
  const [filterMidname, setFilterMidname] = useState("");
  const [filterDesignname, setFilterDesignname] = useState("");
  const [filterConame, setFilterConame] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [filterOuttag, setFilterOuttag] = useState("");
  const [filterUpdatedAt, setFilterUpdatedAt] = useState("");
  const [itemid, setitemid] = useState("");
  const [inputval, setinputval] = useState("")
  const [showfilter, setshowfilter] = useState(false)


  const fetchRecords = async () => {
    const res = await fetch("/api/itemdetail");
    const data = await res.json();
    setRecords(data);
    setFilteredRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    records,
    searchQuery,
    filterDate,
    filterMidname,
    filterDesignname,
    filterConame,
    filterSize,
    filterOuttag,
    filterUpdatedAt,
  ]);

  const item_tag_update = async (id, action) => {
    console.log("chk 1 => ", inputval)

    if (action == "default") {
      setitemid(id);
      setisOutModal(true);
    }
    if (action == "Out" || action == "Cancel") {
      console.log("chk 2 => ", inputval)

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

  const applyFilters = () => {
    const filtered = records.filter((record) => {
      return (
        (!filterDate ||
          moment(record.date).format("YYYY-MM-DD") === filterDate) &&
        (!filterMidname ||
          record.midname
            ?.toLowerCase()
            .includes(filterMidname.toLowerCase())) &&
        (!filterDesignname ||
          record.designname
            ?.toLowerCase()
            .includes(filterDesignname.toLowerCase())) &&
        (!filterConame ||
          record.coname?.toLowerCase().includes(filterConame.toLowerCase())) &&
        (!filterSize || record.size === filterSize) &&
        (!filterOuttag || record.outtag === filterOuttag) &&
        (!filterUpdatedAt ||
          moment(record.updatedAt).format("YYYY-MM-DD") === filterUpdatedAt) &&
        (!searchQuery ||
          Object.values(record).some((value) =>
            String(value).toLowerCase().includes(searchQuery)
          ))
      );
    });
    setFilteredRecords(filtered);
  };

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
    <div className="p-4">
      <div className="grid grid-cols-4 gap-x-4 mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex max-w-50 gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <House className="w-5 h-5" /> Home
        </button>
        <h1 className="text-2xl text-center font-bold">Stock Items</h1>
        <button
          className="  gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => { showfilter ? setshowfilter(false) : setshowfilter(true) }}
        >
          {showfilter ? "Hide Filter" : "Show Filter"}
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records..."
          className="border p-2"
        />
      </div>

      {showfilter && (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <input
          type="date"
          className="border p-2"
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="Date"
        />
        <input
          className="border p-2"
          placeholder="Midname"
          onChange={(e) => setFilterMidname(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Design Name"
          onChange={(e) => setFilterDesignname(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Company Name"
          onChange={(e) => setFilterConame(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Size"
          onChange={(e) => setFilterSize(e.target.value)}
        />
        <select
          className="border p-2"
          onChange={(e) => setFilterOuttag(e.target.value)}
        >
          <option value="">All Outtags</option>
          <option value="Hold">Hold</option>
          <option value="Out">Out</option>
          <option value="Cancel">Cancel</option>
        </select>
        <input
          type="date"
          className="border p-2"
          onChange={(e) => setFilterUpdatedAt(e.target.value)}
          placeholder="Updated At"
        />

      </div>)}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-300 sticky top-0 z-10">
            <tr>
              <th className="p-3">#</th>
              {fields.map((field) => (
                <th key={field} className="p-3 capitalize">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  {fields.map((field) =>
                    field == "outtag" ? (
                      <td key={field} className="p-3">
                        {/* {record[field]} */}

                        {(moment(record.updatedAt).format("DD/MM/YYYY") == moment(new Date).format("DD/MM/YYYY")) || record[field] == "Hold" ? (<button
                          onClick={() => {
                            item_tag_update(record._id, "default", "");
                            // alert(record._id);
                          }}
                          className={`${record[field] == "Out"
                            ? "bg-green-100"
                            : "bg-yellow-300"
                            } min-w-12  py-1 px-2 rounded-2xl `}
                        >
                          {record[field]}
                        </button>) : record[field]}
                      </td>
                    ) : (
                      <td key={field} className="p-3">
                        {field === "updatedAt" || field === "date"
                          ? moment(record[field]).format("DD/MM/YYYY")
                          : record[field]}
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={fields.length + 1}
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
            <h2 className="text-lg font-bold mb-4">{"Stock Out : Details"}</h2>

            <div className="grid grid-cols-2 gap-x-5 py-2">
              <button
                className="border-1 py-5 rounded-2xl bg-red-500"
                onClick={() => {
                  item_tag_update(records._id, "Cancel");
                }}
              >
                Cancel
              </button>

              <button
                className="border-1 rounded-2xl bg-green-400"
                onClick={() => {
                  item_tag_update(records._id, "Out");
                }}
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
                onChange={(e) => {
                  setinputval(e.target.value);
                }}
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

    </div>
  );
}
