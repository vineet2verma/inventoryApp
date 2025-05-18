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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchMastData } from "../components/fetchinvmast";
import { fetchlocationRecords } from "../components/fetchlocationmast";
import { LoginUserFunc } from "../context/loginuser";
import moment from "moment";

export default function StockInPage() {
  const { user } = LoginUserFunc();
  const today = new Date();
  const [records, setRecords] = useState([]);
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
  const [masttype, setMasttype] = useState([]);
  const [mastsize, setMastsize] = useState([]);
  const [size, setsize] = useState([]);
  // const [companyname, setcompanyname] = useState("");
  const [batchno, setbatchno] = useState([]);
  const [quantity, setquantity] = useState([]);
  const [breakage, setbreakage] = useState([]);
  const [mastlocation, setMastlocation] = useState([]);
  const [mastcurrstock, setMastcurrstock] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [rightread, setrightread] = useState(false);
  const [rightcreate, setrightcreate] = useState(false);
  const [rightedit, setrightedit] = useState(false);
  const [rightdelete, setrightdelete] = useState(false);

  // Fetch records from the API
  const fetchInvMastRecords = async () => {
    try {
      const masterdata = await fetchMastData();
      setMastdata(masterdata);

      const mstdesign = Array.from(
        new Set(masterdata.map((item) => item.designname))
      );
      setdesignname(mstdesign);

      const msttype = Array.from(new Set(masterdata.map((item) => item.type)));
      setMasttype(msttype);

      // use to update curr stock
      const mstcurrstock = Array.from(
        new Set(masterdata.map((item) => item.currstock))
      );
      setMastcurrstock(mstcurrstock);

      // setMastsize(mstsize)
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  useEffect(() => {
    fetchInvMastRecords(); // Fetch mast records on component mount
    fetchLocations(); // Fetch locations on component mount
    fetchRecords();
  }, []);

  useEffect(() => {
    setrightread(user.user?.pstockin.includes("read"));
    setrightcreate(user.user?.pstockin.includes("create"));
    setrightedit(user.user?.pstockin.includes("update"));
    setrightdelete(user.user?.pstockin.includes("delete"));
  }, [user]);

  // lcoation mast
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "designname") {
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
        createdby: user.user?.name,
      }));

      return; // prevent falling through to the next setFormData
    }

    if (name === "size") {
      const batchnos = mastdata
        .filter(
          (item) => item.designname === selectedDesign && item.size === value
        )
        .map((item) => item.batchno);
      setbatchno(batchnos);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      createdby: user.user?.name,
    }));
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
        designname: "",
        coname: "",
        batchno: "",
        type: "",
        size: "",
        quantity: "",
        breakage: "",
        location: "",
        purprice: "",
        currstock: "",
        remarks: "",
        createdby: user.user?.name,
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
  };

  return (
    <>
      {rightread && (
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <House className="w-5 h-5" />
              Home
            </button>

            <h1 className="text-3xl font-bold text-center mb-2">
              Stock-In Records
            </h1>

            <div className="flex">

              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border mx-2 rounded w-full"
                />
              </div>
              <button
                onClick={handleAddNew}
                className="px-4  bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Add Record
              </button>
            </div>
          </div>

          {/* Filtered Table */}
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
                  <th className="p-2">Current Stock</th>
                  <th className="p-2">Remarks</th>
                  <th className="p-2">Created By</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records
                  .filter((record) =>
                    Object.values(record).some((value) =>
                      value
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                  )
                  .map((record) => (
                    <tr key={record._id} className="border-t">
                      <td className="p-2">{record.date}</td>
                      <td className="p-2">{record.designname}</td>
                      <td className="p-2">{record.coname}</td>
                      <td className="p-2">{record.batchno}</td>
                      <td className="p-2">{record.size}</td>
                      <td className="p-2">{record.quantity}</td>
                      <td className="p-2">{record.breakage}</td>
                      <td className="p-2">{record.location}</td>
                      <td className="p-2">{record.currstock}</td>
                      <td className="p-2">{record.remarks}</td>
                      <td className="p-2">{record.createdby}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:underline"
                        >
                          <Pencil className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:underline"
                        >
                          <Trash2 className="w-4 h-4 inline" />
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
                      type="date"
                      name="date"
                      disabled
                      required
                      value={moment(today).format("yyyy-MM-DD")} // value={FormDataEvent.data}
                      onChange={handleChange}
                      placeholder="Date"
                      className="border p-2 rounded w-full"
                    />
                    <select
                      type="text"
                      name="designname"
                      value={formData.designname}
                      onChange={handleChange}
                      placeholder="Design Name"
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
                      onChange={handleChange}
                      placeholder="Size"
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
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="border p-2 rounded w-full"
                    />

                    <select
                      name="batchno"
                      onChange={handleChange}
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
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Quantity"
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="number"
                      name="breakage"
                      value={formData.breakage}
                      onChange={handleChange}
                      placeholder="Breakage"
                      className="border p-2 rounded w-full"
                    />
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
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
                      onChange={handleChange}
                      placeholder="Remarks"
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      disabled
                      name="createdby"
                      value={user.user?.name}
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

      )}

    </>


  );
}
