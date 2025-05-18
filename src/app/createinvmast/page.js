"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, House } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginUserFunc } from "../context/loginuser";
import { fetchTypeRecords } from "../components/fetchtypemast";
import { fetchlocationRecords } from "@/app/components/fetchlocationmast";

export default function InventoryMaster() {
  const { user } = LoginUserFunc();
  const [records, setRecords] = useState([]); // data
  const [filteredRecords, setFilteredRecords] = useState([]); //filter - backup
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [mainfilterbackup, setmainfilterbackup] = useState([]);
  const router = useRouter();
  const [rightread, setrightread] = useState(false);
  const [rightcreate, setrightcreate] = useState(false);
  const [rightedit, setrightedit] = useState(false);
  const [rightdelete, setrightdelete] = useState(false);

  // Fetch records from createinvmast
  const fetchRecords = async () => {
    const res = await fetch("/api/createinvmast");
    const data = await res.json();
    setRecords(data);
    setFilteredRecords(data); // Initialize filtered records
  };

  // Fetch type list from typemast
  const fetchTypeList = async () => {
    const typelist = await fetchTypeRecords();
    setTypeList(typelist);
  };

  // Fetch location list from locationmast
  const fetchLocationMast = async () => {
    const locationList = await fetchlocationRecords();
    setLocationList(locationList);
  };

  useEffect(() => {
    fetchRecords();
    fetchTypeList();
    fetchLocationMast();
  }, []);

  useEffect(() => {
    setrightread(user.user?.pinventory.includes("read"));
    setrightcreate(user.user?.pinventory.includes("create"));
    setrightedit(user.user?.pinventory.includes("update"));
    setrightdelete(user.user?.pinventory.includes("delete"));
  }, [user]);

  const handleDelete = async (id) => {
    await fetch("/api/createinvmast", {
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

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { id: editingId, ...formData } : formData;

    await fetch("/api/createinvmast", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchRecords();
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    if (query == "") {
      const filtered = records.filter((record) =>
        Object.values(record).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );

      setFilteredRecords(filtered);
      setmainfilterbackup(filtered);
    } else {
      let req = await fetch("/api/searchinvmastpage?query=" + query);
      let res = await req.json();
      setmainfilterbackup(res.data);
      res.error ? setFilteredRecords(res.data) : setFilteredRecords(res.data);
    }
  };

  const handleTypeSearch = (x) => {
    if (x.target.value != "Select Type") {
      let filterType = mainfilterbackup.filter((e) => e.type == x.target.value);
      setFilteredRecords(filterType);
    } else {
      setFilteredRecords(mainfilterbackup);
    }
  };
  const handleSizeSearch = (x) => {
    if (x.target.value != "Select Size") {
      let filterType = mainfilterbackup.filter((e) => e.size == x.target.value);
      setFilteredRecords(filterType);
    } else {
      setFilteredRecords(mainfilterbackup);
    }
  };

  return (
    <>
      {rightread && (
        <div className="min-h-screen p-4 bg-gray-100 ">
          <div className="sticky top-0  flex flex-wrap justify-between items-center mb-4 gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <House className="w-5 h-5" />
              Home
            </button>
            {/* <h1 className="text-2xl font-bold">Inventory Master</h1> */}

            <div className="flex flex-wrap items-center gap-2">
              <select
                className="border rounded-full px-4 py-2 "
                onChange={handleTypeSearch}
              >
                <option>Select Type</option>
                <option>Regular</option>
                <option>Discontinue</option>
                <option>On Order</option>
              </select>

              <select
                className="rounded-full border px-4 py-2"
                onChange={handleSizeSearch}
              >
                <option>Select Size</option>
                {Array.from(new Set(mainfilterbackup.map((x) => x.size))).map(
                  (item, i) => (
                    <option key={i}>{item}</option>
                  )
                )}
              </select>

              {/* Search Bar */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search"
                className="w-full sm:w-auto px-4 py-2 border rounded-full"
              />
              {rightcreate && (
                <button
                  onClick={showForm ? handleCancel : handleAdd}
                  className={
                    showForm
                      ? "flex items-center bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                      : "flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />{" "}
                  {showForm ? "Cancel" : "Add Inventory"}
                </button>
              )}

            </div>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                "designname",
                "coname",
                "batchno",
                "type",
                "size",
                "weight",
                "pcperbox",
                "minqty",
                "maxqty",
                "opstock",
                "holdstock",
                "location",
                // "purprice",
              ].map((field) =>
                field === "type" ? (
                  <select
                    key={field}
                    placeholder={field}
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="p-2 border rounded-xl w-full"
                  >
                    <option value="" disabled>
                      Select {field}
                    </option>
                    {typeList.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : field === "location" ? (
                  <select
                    key={field}
                    placeholder={field}
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="p-2 border rounded-xl w-full"
                  >
                    <option value="" disabled>
                      Select {field}
                    </option>
                    {locationList.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    key={field}
                    type={
                      [
                        "batchno",
                        "weight",
                        "pcperbox",
                        "minqty",
                        "maxqty",
                        "opstock",
                        "purprice",
                        "holdstock",
                      ].includes(field)
                        ? "number"
                        : "text"
                    }
                    placeholder={field}
                    required
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="p-2 border rounded-xl w-full"
                  />
                )
              )}

              <button
                type="submit"
                className="col-span-1 sm:col-span-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
              >
                {editingId ? "Update Record" : "Create Record"}
              </button>
            </form>
          )}

          <div className="  bg-white p-0 rounded-xl shadow-md overflow-x-auto overflow-y-auto max-h-140 ">
            <table className="min-w-full text-sm text-left table-auto ">
              <thead className="bg-gray-400 sticky top-0  ">
                <tr>
                  <th className="p-2">Design</th>
                  <th className="p-2">Company</th>
                  <th className="p-2">Batch</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Size</th>
                  <th className="p-2">Weight</th>
                  <th className="p-2">Pcs/Box</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Min. Qty</th>
                  <th className="p-2">Max. Qty</th>
                  <th className="p-2">Op. Stock</th>
                  <th className="p-2">Hold Stock</th>
                  <th className="p-2">Cl. Stock</th>
                  {/* <th className="p-2">Pur. Price</th> */}
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr key={rec._id} className="border-t">
                    <td className="p-2">{rec.designname}</td>
                    <td className="p-2">{rec.coname}</td>
                    <td className="p-2">{rec.batchno}</td>
                    <td className="p-2">{rec.type}</td>
                    <td className="p-2">{rec.size}</td>
                    <td className="p-2">{rec.weight}</td>
                    <td className="p-2">{rec.pcperbox}</td>
                    <td className="p-2">{rec.location}</td>
                    <td className={`p-2 ${rec.closingstock < rec.minqty ? "bg-amber-300 " : ''} `}>{rec.minqty}</td>
                    <td className={`p-2 ${parseFloat(rec.closingstock) > parseFloat(rec.maxqty) ? "bg-orange-300 " : ''} `}>{rec.maxqty}</td>
                    <td className="p-2">{rec.opstock}</td>
                    <td className="p-2">{rec.holdstock}</td>
                    <td className="p-2">{rec.closingstock}</td>
                    {/* <td className="p-2">{rec.purprice}</td> */}
                    <td className="p-2 space-x-2">
                      {rightedit && (
                        <button
                          onClick={() => handleEdit(rec)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {rightdelete && (
                        <button
                          onClick={() => handleDelete(rec._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={14} className="text-center p-4 text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
