"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { House, Link, Plus, Edit } from "lucide-react";
import { LoginUserFunc } from "../context/loginuser";
import moment from "moment";

export default function PriceListPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [invMast, setInvMast] = useState([]);
  const [databackup, setdatabackup] = useState([]);
  const [currId, setCurrId] = useState(null);
  const { user } = LoginUserFunc();
  const [action, setaction] = useState(null);

  const [priceFilter, setPriceFilter] = useState("All Price List");
  const [typeFilter, setTypeFilter] = useState("All Type");
  const [sizeFilter, setSizeFilter] = useState("All Sizes");

  const today = new Date();

  const fetchDataInvMast = async () => {
    const resInvMast = await fetch("api/createinvmast");
    const invMastData = await resInvMast.json();
    const resPriceList = await fetch("/api/pricelist");
    const priceListData = await resPriceList.json();

    // Join the two datasets based on _id
    const mergedData = invMastData.map((invItem) => {
      const priceItem = priceListData.find(
        (price) => price._id === invItem._id
      );
      return { ...invItem, ...priceItem }; // Merge the two objects
    });

    setInvMast(mergedData);
    setdatabackup(mergedData);
  };

  useEffect(() => {
    fetchDataInvMast();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    invMast[currId][e.target.name] = e.target.value;
    // const formatteddate = moment(today).format("yyyy-MM-DD")
    // invMast[currId][e.target.data] = formatteddate

    setInvMast(invMast);
  };

  const openModal = (item = {}, ae) => {
    // post
    setFormData({ ...item });
    setCurrId(invMast.indexOf(item));
    setaction(ae);

    // edit
    setEditId(item._id || null);
    setInvMast(invMast);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = action == "edit" ? "PUT" : "POST";
    const url =
      action == "edit" ? `/api/pricelist?id=${editId}` : "/api/pricelist";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({});
    setEditId(null);
    setShowModal(false);
    fetchDataInvMast();
  };

  const handleDelete = async (id) => {
    await fetch("/api/pricelist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const filteredData = databackup.filter((item) => {
    const matchSearch = ["designname", "coname", "size", "type"].some((key) =>
      item[key]?.toLowerCase().includes(search.toLowerCase())
    );

    const matchType = typeFilter === "All Type" || item.type === typeFilter;

    const matchSize =
      sizeFilter === "All Sizes" ||
      item.size?.trim().toLowerCase() === sizeFilter.toLowerCase();

    const matchPrice =
      priceFilter === "All Price List" ||
      (priceFilter === "Price List" && item.ratePerBox != null) ||
      (priceFilter === "No Price List" && item.ratePerBox == null);

    return matchSearch && matchType && matchSize && matchPrice;
  });

  return (
    <div className="">
      <div className="sticky top-0 mb-1 bg-gray-100 flex justify-between mx-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <House className="w-5 h-5" />
          Home
        </button>
        <h1 className="text-3xl font-bold">Price List</h1>
        <div className="mb-1 flex justify-between flex-wrap gap-2">
          <select
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onChange={(e) => {
              setTypeFilter(e.target.value);
            }}
          >
            <option>All Type</option>
            {[...new Set(invMast.map((item) => item.type))].map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onChange={(e) => {
              setSizeFilter(e.target.value);
            }}
          >
            <option>All Sizes</option>
            {[
              ...new Set(invMast.map((item) => item.size.trim().toLowerCase())),
            ].map((size, i) => (
              <option key={i}>{size}</option>
            ))}
          </select>

          <select
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onChange={(e) => {
              setPriceFilter(e.target.value);
            }}
          >
            <option>All Price List</option>
            <option>Price List</option>
            <option>No Price List</option>
          </select>
          <input
            type="text"
            placeholder="Search by any field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full sm:w-64"
          />
          {/* <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded" >
            <Plus className="w-15 h-5" />
          </button> */}
        </div>
      </div>

      <div className="overflow-x-auto max-h-125 rounded-xl  ">
        <table className="min-w-full table-auto bg-white border shadow-md rounded">
          <thead className="sticky top-0  bg-gray-400 text-sm ">
            <tr>
              {[
                "Date",
                "Design Name",
                "Company Name",
                "Size",
                "Type",
                "Packing/Box",
                "Rate/Box",
                "Rate/Pcs",
                "Rate/Sqft",
                "Qty/Sqft",
                // 'Discount',
                "Actions",
              ].map((header) => (
                <th key={header} className="px-4 py-2 border">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id} className="text-sm text-gray-800 border-t">
                <td className="px-4 py-2 border">
                  {item.ratePerBox
                    ? moment(item.updatedAt).format("DD/MM/yyyy")
                    : ""}
                </td>
                <td className="px-4 py-2 border">{item.designname}</td>
                <td className="px-4 py-2 border">{item.coname}</td>
                <td className="px-4 py-2 border">{item.size}</td>
                <td className="px-4 py-2 border">{item.type}</td>
                <td className="px-4 py-2 border">{item.pcperbox}</td>
                <td className="px-4 py-2 border">{item.ratePerBox}</td>
                <td className="px-4 py-2 border">{item.ratePerPcs}</td>
                <td className="px-4 py-2 border">{item.ratePerSqft}</td>
                <td className="px-4 py-2 border">{item.qtyPerSqft}</td>
                {/* <td className="px-4 py-2 border">{item.discount}</td> */}
                <td className="px-4 py-2 border space-x-2">
                  {item.ratePerBox ? (
                    <button
                      onClick={() => openModal(item, "edit")}
                      className="bg-yellow-400 px-2 py-1 rounded text-sm"
                    >
                      <Edit className="w-15 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => openModal(item, "add")} // handleSubmit(item._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      <Plus className="w-15 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Update Entry" : "Add Entry"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              {[
                "date",
                "designname",
                "coname",
                "size",
                "ratePerBox",
                "ratePerPcs",
                "ratePerSqft",
                "qtyPerSqft",
                // 'discount',
              ].map((field) =>
                field == "date" ? (
                  <div>
                    <label className="block text-sm font-medium">{field}</label>
                    <input
                      type="date"
                      key={field}
                      name={field}
                      placeholder={field.replace(/([A-Z])/g, " $1")}
                      value={moment(today).format("yyyy-MM-DD")} // {formData[field] || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-400 rounded-xl"
                    // className="border px-3 rounded"
                    /></div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium">{field}</label>
                    <input
                      type={field == "ratePerBox" || field == "ratePerPcs" || field == "ratePerSqft" || field == "qtyPerSqft" ? "number" : "text"}
                      disabled={field == "ratePerBox" || field == "ratePerPcs" || field == "ratePerSqft" || field == "qtyPerSqft" ? false : true}
                      key={field}
                      name={field}
                      placeholder={field.replace(/([A-Z])/g, " $1")}
                      value={formData[field] || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-400 p-2 rounded-xl"
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => {
                  setFormData({});
                  setEditId(null);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editId ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
