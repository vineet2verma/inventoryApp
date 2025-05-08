"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Pencil, Trash2, PlusCircle, House, Link, Plus, PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DealerMastPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [paymenttype, setPaymentType] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    auid: "",
    name: "",
    coname: "",
    gstno: "",
    mobile: "",
    billaddress: "",
    shipaddress: "",
    paymenttype: "",
    salesman: "",
    discount: "",
    createdby: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);   // item page
  const [mid, setmid] = useState(null);

  const [itemData, setItemData] = useState([]);

  const itemObject = {
    date: "",
    mid: "",
    midname: "",
    designname: "",
    size: "",
    batchno: "",
    coname: "",
    qty: "",
    priceperbox: "",
    outtag: "",
  }
  const [initialitem, setintialitem] = useState(itemObject)

  // Fetch records from the API
  useEffect(() => {
    fetchRecords();
    fetchPaymentTypeRecords();
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
  // payment mast 
  const fetchPaymentTypeRecords = async () => {
    try {
      const res = await fetch("api/paymenttype");
      const data = await res.json();
      const paymentmast = Array.from(new Set(data.filter((item) => item.status == "Active").map((item) => item.payment)));
      setPaymentType(paymentmast);
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
        auid: "",
        name: "",
        coname: "",
        gstno: "",
        mobile: "",
        billaddress: "",
        shipaddress: "",
        paymenttype: "",
        salesman: "",
        discount: "",
        createdby: "",
      });
      setEditId(null);
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      console.error("Failed to save record:", err);
    }
  };

  const handleitemdelete = async (idx) => {

    const res = await fetch("/api/itemdetail", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: idx }),
    })

    let itemdata = itemData.filter((item, i) => item._id != idx)
    setItemData(itemdata);
  }

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
      auid: "",
      name: "",
      coname: "",
      gstno: "",
      mobile: "",
      billaddress: "",
      shipaddress: "",
      paymenttype: "",
      salesman: "",
      discount: "",
      createdby: "",
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  const handlemid = (id) => {
    fetchItemDetailById(id)
    setmid(id)
    setShowModal(true)
    setintialitem({ ...initialitem, mid: id })
  }

  const fetchItemDetailById = async (id) => {
    const res = await fetch('/api/itemdetail?id=' + id);
    const data = await res.json();
    setItemData(data);

    console.log(data)

  }


  const handleItemChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // setItemData((prev) => ({ ...prev, [name]: value }));
    setintialitem((prev) => ({ ...prev, [name]: value }))
  };



  const handleItemSubmit = async (e) => {
    // e.preventDefault();
    const method = "POST";
    const url = "/api/itemdetail";
    const body = initialitem;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      alert(result.message);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save record:", err);
    }
  };


  const handleAddItem = () => {
    // setShowModal(false);
    setItemData([...itemData, initialitem])

    setintialitem({
      date: "",
      mid: "",
      midname: "",
      designname: "",
      size: "",
      batchno: "",
      coname: "",
      qty: "",
      priceperbox: "",
      outtag: "",
    })

    handleItemSubmit()


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
        <h1 className="text-2xl font-bold text-center mb-4">Dealers Records</h1>

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
            Add New Dealer
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
                    onClick={() => { handlemid(record.auid) }}
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
                  key == "paymenttype" ?
                    (
                      <select
                        key={key}
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        placeholder={key}
                        className="border p-2 rounded w-full text-sm"
                      >
                        {paymenttype.map((item, i) =>
                          <option key={i} value={item} >
                            {item}
                          </option>

                        )}
                      </select>
                    )
                    : key == "mobile" || key == "discount" ? (
                      <input
                        key={key}
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        placeholder={key}
                        className="border p-2 rounded w-full text-sm"
                      />
                    ) : key == "_id" || key == "delId" || key == "createdAt" || key == "updatedAt" || key == "__v" ? '' :
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

      {/* Modal */}
      {
        showModal && (
          /* <form> */
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" >
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 text-sm">
              <h3 className="text-lg font-semibold mb-4">Add Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["date", "mid", "midname", "designname", "coname", "batchno", "size", "qty", "outtag", "priceperbox"].map((field, idx) => (
                  <div key={idx}>
                    <label className="block mb-1 capitalize text-gray-600">{field}</label>
                    <input
                      type="text"
                      name={field}
                      value={initialitem[field]}
                      onChange={handleItemChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Add Items
                </button>


              </div>

              {/* Item Details */}
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Added Items</h3>
                <div className="overflow-auto">
                  <table className="w-full text-sm text-left border">
                    <thead className="bg-gray-100">
                      <tr>
                        {["Date", "Mid Name", "Design", "Company", "Batch", "Size", "Qty", "Price", "Tag", "Action"].map((h, i) => (
                          <th key={i} className="px-3 py-2 border">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {itemData.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-3 py-1 border">{item.date}</td>
                          <td className="px-3 py-1 border">{item.midname}</td>
                          <td className="px-3 py-1 border">{item.designname}</td>
                          <td className="px-3 py-1 border">{item.coname}</td>
                          <td className="px-3 py-1 border">{item.batchno}</td>
                          <td className="px-3 py-1 border">{item.size}</td>
                          <td className="px-3 py-1 border">{item.qty}</td>
                          <td className="px-3 py-1 border">{item.priceperbox}</td>
                          <td className="px-3 py-1 border">{item.outtag}</td>
                          <td className="px-3 py-1 border">
                            <button
                              onClick={() => handleitemdelete(item._id)}
                              className="text-red-600 hover:text-red-800" >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Item Details */}



            </div>
          </div>
        )

      }
    </div >
  );
}