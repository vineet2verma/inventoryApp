"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, House } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginUserFunc } from "../context/loginuser";

export default function DealerMastPage() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mastdata, setMastdata] = useState([]);
  const [designname, setdesignname] = useState([]);
  const [selecteddesignname, setSelectedDesign] = useState("");
  const [companys, setCompanys] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedsize, setselectedsize] = useState("");
  const [batchnos, setBatchnos] = useState([]);
  const [selectedbatch, setselectedbatch] = useState("");
  const [mastlocations, setMastlocations] = useState([]);

  const [formData, setFormData] = useState({
    designname: "",
    coname: "",
    batchno: "",
    size: "",
    breakage: "",
    remarks: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [rightread, setrightread] = useState(false);
  const [rightcreate, setrightcreate] = useState(false);
  const [rightedit, setrightedit] = useState(false);
  const [rightdelete, setrightdelete] = useState(false);

  const { user } = LoginUserFunc();

  useEffect(() => {
    fetchInvMastRecords();
    fetchLocations();
    fetchRecords();
  }, []);

  useEffect(() => {
    setrightread(user.user?.pbreakage.includes("read"));
    setrightcreate(user.user?.pbreakage.includes("create"));
    setrightedit(user.user?.pbreakage.includes("update"));
    setrightdelete(user.user?.pbreakage.includes("delete"));
  }, [user]);

  const fetchRecords = async () => {
    try {
      const resBreakageMast = await fetch("/api/breakagemast");
      const breakagemastData = await resBreakageMast.json();
      const resStockInMast = await fetch("/api/stockin");
      const stockinmastData = await resStockInMast.json();

      const filterstockinmastData = stockinmastData
        .filter((item) => item.breakage > 0)
        .map(
          ({ _id, designname, coname, batchno, size, breakage, remarks }) => ({
            _id,
            designname,
            coname,
            batchno,
            size,
            breakage,
            remarks,
          })
        );

      const mergeData = [...breakagemastData, ...filterstockinmastData];

      setRecords(mergeData);
      setFilteredRecords(mergeData);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const fetchInvMastRecords = async () => {
    try {
      const res = await fetch("/api/createinvmast");
      const data = await res.json();
      setMastdata(data);
      const mstdesign = Array.from(
        new Set(data.map((item) => item.designname))
      );
      setdesignname(mstdesign);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/location");
      const data = await res.json();
      const locationnames = data
        .filter((item) => item.status == "Active")
        .map((item) => item.location);
      setMastlocations(Array.from(new Set(locationnames)));
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
    if (e.target.name === "designname") {
      const sizes = mastdata
        .filter((item) => item.designname === e.target.value)
        .map((item) => item.size);
      setSizes(Array.from(new Set(sizes)));
      setSelectedDesign(e.target.value);
    }
    if (e.target.name === "size") {
      const bno = mastdata
        .filter(
          (item) =>
            item.designname === selecteddesignname &&
            item.size === e.target.value
        )
        .map((item) => item.batchno);
      setselectedsize(e.target.value);
      setBatchnos(Array.from(new Set(bno)));
    }
    if (e.target.name === "batchno") {
      const cno = mastdata
        .filter(
          (item) =>
            item.designname === selecteddesignname &&
            item.size === selectedsize &&
            item.batchno === e.target.value
        )
        .map((item) => item.coname);
      setCompanys(cno);
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = "/api/breakagemast";
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
        designname: "",
        coname: "",
        batchno: "",
        size: "",
        breakage: "",
        remarks: "",
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
      const res = await fetch("/api/breakagemast", {
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
      designname: "",
      coname: "",
      batchno: "",
      size: "",
      breakage: "",
      remarks: "",
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {rightread && (
        <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="grid grid-cols-1 lg:max-w-50 gap-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full"
              >
                <House className="w-5 h-5" /> Home
              </button>
            </div>

            <div className="flex justify-center items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-center">
                Breakage / Missing Records
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2  items-center gap-1 ">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search records..."
                className="border p-2 rounded text-sm w-full  "
              />
              {rightcreate && (
                <button
                  onClick={handleAddNew}
                  className="bg-blue-600 text-white px-2 py-2  rounded-xl hover:bg-blue-700 w-full sm:w-auto "
                >
                  Add Record
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow-md text-xs sm:text-sm">
              <thead className="bg-gray-200">
                <tr>
                  {Object.keys(formData).map((key) => (
                    <th key={key} className="p-1 sm:p-2 text-center capitalize">
                      {key}
                    </th>
                  ))}
                  <th className="p-1 sm:p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record._id} className="border-t">
                    {Object.keys(formData).map((key) => (
                      <td key={key} className="px-1 sm:px-2 border text-center">
                        {record[key]}
                      </td>
                    ))}
                    <td className="px-1 sm:px-2 border text-center">
                      {rightedit && (
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-green-700 px-1 py-1 hover:bg-yellow-600 mr-1"
                        >
                          <Pencil />
                        </button>
                      )}
                      {rightdelete && (
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-800 px-1 py-1 hover:bg-red-600"
                        >
                          <Trash2 />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 sm:p-6 rounded shadow-md w-full max-w-3xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-lg font-semibold mb-4">
                  {editId ? "Edit Record" : "Add New Record"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {Object.keys(formData).map((key, i) => (
                      <div key={i}>
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </label>
                        {key === "designname" ? (
                          <select
                            id={key}
                            name={key}
                            onChange={handleChange}
                            className="border p-2 rounded w-full text-sm"
                          >
                            {designname.map((item, i) => (
                              <option key={i} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        ) : key === "size" ? (
                          <select
                            id={key}
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="border p-2 rounded w-full text-sm"
                          >
                            {sizes.map((item, i) => (
                              <option key={i} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        ) : key === "batchno" ? (
                          <select
                            id={key}
                            name={key}
                            onChange={handleChange}
                            className="border p-2 rounded w-full text-sm"
                          >
                            {batchnos.map((item, i) => (
                              <option key={i} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        ) : key === "breakage" ? (
                          <input
                            id={key}
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="border p-2 rounded w-full text-sm"
                          />
                        ) : key === "coname" ? (
                          <select
                            id={key}
                            name={key}
                            onChange={handleChange}
                            className="border p-2 rounded w-full text-sm"
                          >
                            {companys.map((item, i) => (
                              <option key={i} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={key}
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="border p-2 rounded w-full text-sm"
                          />
                        )}
                      </div>
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
      )}
    </>
  );
}
