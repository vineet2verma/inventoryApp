"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Pencil, Trash2, PlusCircle, House, Link } from "lucide-react";
import { useRouter } from "next/navigation";



export default function StockInPage() {

  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    designName: "",
    coName: "",
    batchNo: "",
    type: "",
    size: "",
    quantity: "",
    location: "",
    breakage: "",
    purPrice: "",
    currStock: "",
    createdBy: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mastdata, setMastdata] = useState([]);
  const [mastdesigname, setdesignname] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState("");
  const [masttype, setMasttype] = useState([]);
  const [mastsize, setMastsize] = useState([]);
  const [quantity, setquantity] = useState([]);
  const [breakage, setbreakage] = useState([]);
  const [mastlocation, setMastlocation] = useState([]);
  const [mastcurrstock, setMastcurrstock] = useState([]);
  const router = useRouter();

  // Fetch records from the API
  const fetchInvMastRecords = async () => {
    try {
      const res = await fetch("/api/createinvmast");
      const data = await res.json();
      setMastdata(data);
      const mstdesign = Array.from(new Set(data.map((item) => item.designname)));
      const msttype = Array.from(new Set(data.map((item) => item.type)));
      const mstsize = Array.from(new Set(data.map((item) => item.size)));
      // const mstlocation = Array.from(new Set(data.map((item) => item.location)));  // come from location mast later on
      const mstcurrstock = Array.from(new Set(data.map((item) => item.currstock)));

      setMasttype(msttype)
      setMastsize(mstsize)
      setMastcurrstock(mstcurrstock)
      setdesignname(mstdesign)

    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  }
  // console.log(mastdata)

  useEffect(() => {
    fetchInvMastRecords(); // Fetch mast records on component mount
    fetchLocations(); // Fetch locations on component mount
    fetchRecords();

  }, []);
  // lcoation mast
  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/location");
      const data = await res.json();
      let aa = [];
      {
        data.map((item, i) => (
          aa.push(item.location)
        ))
      }
      setMastlocation(Array.from(new Set(aa)));

    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
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

  const handleSelectedDesign = (e) => {
    setSelectedDesign(e.target.value);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log(e.target.name)
    e.target.name == "designName" ? handleSelectedDesign(e) : null;
  };

  // console.log(mastdata.filter((item) => item.designname == selectedDesign)[0]?.coname)
  // console.log(mastlocation)

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
        designName: "",
        coName: "",
        batchNo: "",
        type: "",
        size: "",
        quantity: "",
        breakage: "",
        location: "",
        purPrice: "",
        currStock: "",
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
      date: "",
      designName: "",
      coName: "",
      batchNo: "",
      type: "",
      size: "",
      quantity: "",
      location: "",
      breakage: "",
      purPrice: "",
      currStock: "",
      createdBy: "",
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <House className="w-5 h-5" />
          Home
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Stock-In Records</h1>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          Add Record
        </button>
      </div>


      {/* Table */}
      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Design Name</th>
              <th className="p-2">Company Name</th>
              <th className="p-2">Batch No</th>
              <th className="p-2">Type</th>
              <th className="p-2">Size</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Breakage</th>
              <th className="p-2">Location</th>
              <th className="p-2">Purchase Price</th>
              <th className="p-2">Current Stock</th>
              <th className="p-2">Created By</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="border-t">
                <td className="p-2">{record.date}</td>
                <td className="p-2">{record.designName}</td>
                <td className="p-2">{record.coName}</td>
                <td className="p-2">{record.batchNo}</td>
                <td className="p-2">{record.type}</td>
                <td className="p-2">{record.size}</td>
                <td className="p-2">{record.quantity}</td>
                <td className="p-2">{record.breakage}</td>
                <td className="p-2">{record.location}</td>
                <td className="p-2">{record.purPrice}</td>
                <td className="p-2">{record.currStock}</td>
                <td className="p-2">{record.createdBy}</td>
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
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Date"
                  className="border p-2 rounded w-full"
                />
                <select
                  // type="text"
                  name="designName"
                  value={formData.designName}
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


                <input
                  type="text"
                  name="coName"
                  value={mastdata.filter((item) => item.designname == selectedDesign)[0]?.coname}
                  onChange={(e) => { handleChange(e) }}
                  placeholder="Company Name"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="batchNo"
                  value={formData.batchNo}
                  onChange={handleChange}
                  placeholder="Batch No"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="type"
                  value={mastdata.filter((item) => item.designname == selectedDesign)[mastdata.filter((item) => item.designname == selectedDesign).length - 1]?.type}
                  onChange={(e) => { handleChange(e) }}
                  placeholder="Type"
                  className="border p-2 rounded w-full"
                />
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
                  name="purPrice"
                  value={formData.purPrice}
                  onChange={handleChange}
                  placeholder="Purchase Price"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="currStock"
                  value={formData.currStock}
                  onChange={handleChange}
                  placeholder="Current Stock"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="createdBy"
                  value={formData.createdBy}
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
  );
}