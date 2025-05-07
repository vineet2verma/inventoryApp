"use client";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  PlusCircle,
  House,
  Link,
  Plus,
  PackagePlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DealerMastPage() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mastdata, setMastdata] = useState([]);
  const [designname, setdesignname] = useState([]);
  const [companys, setCompanys] = useState([]);
  const [batchnos, setBatchnos] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [mastlocations, setMastlocations] = useState([]);

  const [formData, setFormData] = useState({
    designname: "",
    coname: "",
    batchno: "",
    size: "",
    breakageqty: "",
    remarks: "",
    closingstock: "",
    createdby: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Fetch records from the API
  useEffect(() => {
    fetchInvMastRecords(); // Fetch mast records on component mount
    fetchLocations(); // Fetch locations on component mount
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/breakagemast");
      const data = await res.json();
      setRecords(data);
      setFilteredRecords(data); // Initialize filtered records
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  // Fetch records from the API
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

  // lcoation mast
  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/location");
      const data = await res.json();
      const locationnames = data.filter((item)=>item.status=="Active").map((item)=>item.location)
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // e.target.name == "designName" ? setSelectedDesign(e.target.value) : null;
    
    const companydata = mastdata.filter((item) => item.designname == e.target.value).map((item) => item.coname);
    setCompanys(Array.from(new Set(companydata)));

    const sizes = mastdata.filter((item) => item.designname == e.target.value ).map((item) => item.size);
    setSizes(Array.from(new Set(sizes)));

    const batchnos = mastdata.filter((item)=>item.designname==e.target.value && item.size == e.target.value ).map((item)=>item.batchno);
    setBatchnos(Array.from(new Set(batchnos)))

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
        breakageqty: "",
        remarks: "",
        closingstock: "",
        createdby: "",
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
      breakageqty: "",
      remarks: "",
      closingstock: "",
      createdby: "",
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
        <h1 className="text-2xl font-bold text-center mb-4">
          Breakage Records
        </h1>

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
                    onClick={() => alert("working on it")}
                    className="text-yellow-800 px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    <PackagePlus />
                  </button>
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-green-700  px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    <Pencil />
                    {/* Edit */}
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className=" text-red-800 px-2 py-1 rounded hover:bg-red-600"
                  >
                    <Trash2 />
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
                  key == "designname" ? (
                    <select
                      key={key}
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key}
                      className="border p-2 rounded w-full text-sm"
                    >
                      {designname.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : 
                  key == "size" ? (
                    <select
                      key={key}
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key}
                      className="border p-2 rounded w-full text-sm"
                    >
                      {sizes.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) :
                  key == "batchno" ? (
                    <select
                      key={key}
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key}
                      className="border p-2 rounded w-full text-sm"
                    >
                      {batchnos.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) :
                  key == "breakageqty" ||
                    key == "closingstock" ||
                    key == "batchno" ? (
                    <input
                      key={key}
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key}
                      className="border p-2 rounded w-full text-sm"
                    />
                  ) : key == "_id" ? (
                    ""
                  ) : (
                    <input
                      key={key}
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key}
                      className="border p-2 rounded w-full text-sm"
                    />
                  )
                )}
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
