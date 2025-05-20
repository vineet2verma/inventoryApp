"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, House } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchMastData } from "../components/fetchinvmast";
import { fetchlocationRecords } from "../components/fetchlocationmast";
import { LoginUserFunc } from "../context/loginuser";
import moment from "moment";

export default function StockInPage() {
  const { user } = LoginUserFunc();
  const today = new Date();
  const router = useRouter();
  const [showfilter, setshowfilter] = useState(false);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [formData, setFormData] = useState({
    date: moment(today).format("yyyy-MM-DD"),
    designname: "",
    coname: "",
    batchno: "",
    type: "",
    size: "",
    quantity: "",
    location: "",
    breakage: "",
    purprice: "",
    currstock: "",
    remarks: "",
    createdby: user.user?.name,
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mastdata, setMastdata] = useState([]);
  const [mastdesigname, setdesignname] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState("");
  const [mastsize, setMastsize] = useState([]);
  const [batchno, setbatchno] = useState([]);
  const [mastlocation, setMastlocation] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    designname: "",
    coname: "",
    location: "",
  });
  const [rightread, setrightread] = useState(false);
  const [rightcreate, setrightcreate] = useState(false);
  const [rightedit, setrightedit] = useState(false);
  const [rightdelete, setrightdelete] = useState(false);

  useEffect(() => {
    fetchInvMastRecords();
    fetchLocations();
    fetchRecords();
  }, []);

  useEffect(() => {
    setrightread(user.user?.pstockin.includes("read"));
    setrightcreate(user.user?.pstockin.includes("create"));
    setrightedit(user.user?.pstockin.includes("update"));
    setrightdelete(user.user?.pstockin.includes("delete"));
  }, [user]);

  useEffect(() => {
    const filtered = records.filter((record) => {
      return (
        (filters.date === "" || record.date.includes(filters.date)) &&
        (filters.designname === "" ||
          record.designname === filters.designname) &&
        (filters.coname === "" || record.coname === filters.coname) &&
        (filters.location === "" || record.location === filters.location)
      );
    });
    setFilteredRecords(filtered);
  }, [filters, records]);

  const fetchInvMastRecords = async () => {
    try {
      const masterdata = await fetchMastData();
      setMastdata(masterdata);

      const mstdesign = Array.from(
        new Set(masterdata.map((item) => item.designname))
      );
      setdesignname(mstdesign);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const fetchLocations = async () => {
    const locationmastrecords = await fetchlocationRecords();
    setMastlocation(locationmastrecords);
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/stockin");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (record) => {
    setFormData({ ...record });
    setSelectedDesign(record.designname);
    const sizes = mastdata
      .filter((item) => item.designname === record.designname)
      .map((item) => item.size);
    setMastsize(Array.from(new Set(sizes)));

    const batchnos = mastdata
      .filter(
        (item) =>
          item.designname === record.designname && item.size === record.size
      )
      .map((item) => item.batchno);
    setbatchno(batchnos);

    setEditId(record._id);
    setIsModalOpen(true);
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

      if (result.success !== false) {
        alert(result.message);
        setFormData({
          date: moment(today).format("yyyy-MM-DD"),
          designname: "",
          coname: "",
          batchno: "",
          type: "",
          size: "",
          quantity: "",
          location: "",
          breakage: "",
          purprice: "",
          currstock: "",
          remarks: "",
          createdby: user.user?.name,
        });
        setEditId(null);
        setIsModalOpen(false);
        fetchRecords();
      } else {
        alert(result.message || "Failed to save record");
      }
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

  return (
    <>
      {rightread && (
        <div className="p-3 bg-gray-100 min-h-screen">
          <div className="grid grid-cols-4 gap-x-15 mb-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="grid grid-cols-2 gap-2 px-4 py-3 max-w-40 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <House className="w-5 h-5" /> Home
            </button>

            <h1 className="text-3xl font-bold text-center mb-2">
              Stock-In Records
            </h1>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              onClick={() => {
                showfilter ? setshowfilter(false) : setshowfilter(true);
              }}
            >
              {showfilter ? "Hide Filter" : "Show Filter"}
            </button>

            <button
              onClick={() => {
                setFormData({
                  date: moment(today).format("yyyy-MM-DD"),
                  designname: "",
                  coname: "",
                  batchno: "",
                  type: "",
                  size: "",
                  quantity: "",
                  location: "",
                  breakage: "",
                  purprice: "",
                  currstock: "",
                  remarks: "",
                  createdby: user.user?.name,
                });
                setEditId(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Add Record
            </button>
          </div>

          {showfilter && (
            <div className="bg-white p-4 mb-4 rounded-xl shadow-md flex gap-4 flex-wrap">
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="border p-2 rounded"
              />
              <select
                name="designname"
                value={filters.designname}
                onChange={handleFilterChange}
                className="border p-2 rounded"
              >
                <option value="">All Designs</option>
                {mastdesigname.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="coname"
                placeholder="Company Name"
                value={filters.coname}
                onChange={handleFilterChange}
                className="border p-2 rounded"
              />
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="border p-2 rounded"
              >
                <option value="">All Locations</option>
                {mastlocation.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Design Name</th>
                  <th className="p-2">Company Name</th>
                  <th className="p-2">Batch No</th>
                  <th className="p-2">Size</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Breakage</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Remarks</th>
                  <th className="p-2">Created By</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record._id} className="border-t">
                    <td className="p-2">{record.date}</td>
                    <td className="p-2">{record.designname}</td>
                    <td className="p-2">{record.coname}</td>
                    <td className="p-2">{record.batchno}</td>
                    <td className="p-2">{record.size}</td>
                    <td className="p-2">{record.quantity}</td>
                    <td className="p-2">{record.breakage}</td>
                    <td className="p-2">{record.location}</td>
                    <td className="p-2">{record.remarks}</td>
                    <td className="p-2">{record.createdby}</td>
                    <td className="p-2 flex gap-2">
                      {rightedit && (
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:underline"
                        >
                          <Pencil className="w-4 h-4 inline" />
                        </button>
                      )}
                      {rightdelete && (
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:underline"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">
                  {editId ? "Edit Record" : "Add New Record"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      name="date"
                      disabled
                      value={formData.date}
                      onChange={() => {}}
                      className="border p-2 rounded w-full"
                    />
                    <select
                      name="designname"
                      value={formData.designname}
                      onChange={(e) => {
                        const value = e.target.value;
                        const sizes = mastdata
                          .filter((item) => item.designname === value)
                          .map((item) => item.size);
                        setMastsize(Array.from(new Set(sizes)));
                        setSelectedDesign(value);
                        const companynames = mastdata
                          .filter((item) => item.designname === value)
                          .map((item) => item.coname);
                        const selectedCompanyName = companynames[0] || "";
                        setFormData((prev) => ({
                          ...prev,
                          designname: value,
                          coname: selectedCompanyName,
                        }));
                      }}
                      className="border p-2 rounded w-full"
                      required
                    >
                      <option value="">Select Design Name</option>
                      {mastdesigname.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={(e) => {
                        const value = e.target.value;
                        const batchnos = mastdata
                          .filter(
                            (item) =>
                              item.designname === selectedDesign &&
                              item.size === value
                          )
                          .map((item) => item.batchno);
                        setbatchno(batchnos);
                        setFormData((prev) => ({ ...prev, size: value }));
                      }}
                      className="border p-2 rounded w-full"
                      required
                    >
                      <option value="">Select Size</option>
                      {mastsize.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="coname"
                      value={formData.coname}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          coname: e.target.value,
                        }))
                      }
                      className="border p-2 rounded w-full"
                      placeholder="Company Name"
                    />
                    <select
                      name="batchno"
                      value={formData.batchno}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          batchno: e.target.value,
                        }))
                      }
                      className="border p-2 rounded w-full"
                      required
                    >
                      <option value="">Select Batch No</option>
                      {batchno.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      className="border p-2 rounded w-full"
                      placeholder="Quantity"
                    />
                    <input
                      type="number"
                      name="breakage"
                      value={formData.breakage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          breakage: e.target.value,
                        }))
                      }
                      className="border p-2 rounded w-full"
                      placeholder="Breakage"
                    />
                    <select
                      name="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="border p-2 rounded w-full"
                      required
                    >
                      <option value="">Select Location</option>
                      {mastlocation.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          remarks: e.target.value,
                        }))
                      }
                      className="border p-2 rounded w-full"
                      placeholder="Remarks"
                    />
                    <input
                      type="text"
                      disabled
                      name="createdby"
                      value={formData.createdby}
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
      )}
    </>
  );
}
