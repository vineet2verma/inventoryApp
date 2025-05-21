"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { Pencil, Trash2, PackagePlus } from "lucide-react";

export default function MorbiOrderPage() {
  const [orders, setOrders] = useState([]);
  const [showfilter, setshowfilter] = useState(false);
  const [formData, setFormData] = useState({
    date: moment().format("YYYY-MM-DD"),
    design: "",
    size: "",
    qty: "",
    customername: "",
    location: "",
    salesman: "",
    orderconfirmation: "",
    remarks: "",
    availability: "",
    readydate: "",
    deliverydate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    design: "",
    size: "",
    customername: "",
    salesman: "",
    orderconfirmation: "",
    availability: "",
    readydate: "",
    deliverydate: "",
  });

  const fetchOrders = async () => {
    const res = await fetch("/api/morbi");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleNewOrder = async (e) => {
    setFormData({
      date: moment().format("YYYY-MM-DD"),
      design: "",
      size: "",
      qty: "",
      customername: "",
      location: "",
      salesman: "",
      orderconfirmation: "",
      remarks: "",
      availability: "",
      readydate: "",
      deliverydate: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const res = await fetch("/api/morbi", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    await fetchOrders();
    showToast(editingId ? "Order updated" : "Order created");

    setFormData({
      date: moment().format("YYYY-MM-DD"),
      design: "",
      size: "",
      qty: "",
      customername: "",
      location: "",
      salesman: "",
      orderconfirmation: "",
      remarks: "",
      availability: "",
      readydate: "",
      deliverydate: "",
    });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleEdit = (order) => {
    setFormData({
      ...order,
      date: moment(order.date).format("YYYY-MM-DD"),
      readydate: order.readydate
        ? moment(order.readydate).format("YYYY-MM-DD")
        : "",
      deliverydate: order.deliverydate
        ? moment(order.deliverydate).format("YYYY-MM-DD")
        : "",
    });
    setEditingId(order._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    // if (!confirm("Are you sure to delete this paymenttype?")) return;
    const res = await fetch("/api/morbi", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchOrders();
    showToast("Order deleted", "error");
  };

  const filteredOrders = orders.filter((order) =>
    Object.entries(filters).every(([key, value]) =>
      value
        ? order[key]?.toString().toLowerCase().includes(value.toLowerCase())
        : true
    )
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        <h1 className="text-center md:text-left text-2xl font-bold   ">Morbi Order Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => {
              showfilter ? setshowfilter(false) : setshowfilter(true);
            }}
          >
            {showfilter ? "Hide Filter" : "Show Filter"}
          </button>
          <button
            onClick={() => handleNewOrder()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            + New Order
          </button>
        </div>
      </div>

      {showfilter && (
        <div className="my-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(filters).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize mb-1">
                Filter by {key}
              </label>
              <input
                type="text"
                name={key}
                value={filters[key]}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div
          className={`p-2 rounded text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-lg w-[95%] sm:w-[90%] max-w-4xl relative">
            <button
              onClick={() => {
                setModalOpen(false);
                setEditingId(null);
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit" : "New"} Order
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {Object.keys(formData).map((key) =>
                key != "_id" &&
                key != "createdAt" &&
                key != "updatedAt" &&
                key != "__v" &&
                key != "availability" &&
                key != "readydate" &&
                key != "deliverydate" ? (
                  <div key={key}>
                    <label className="block text-sm font-medium capitalize">
                      {key}
                    </label>
                    {key == "orderconfirmation" ? (
                      <select
                        // type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="mt-1 p-2 border w-full rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Cancel">Cancel</option>
                      </select>
                    ) : (
                      <input
                        type={key.includes("date") ? "date" : "text"}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        required={
                          key !== "remarks" &&
                          key !== "availability" &&
                          key !== "orderconfirmation"
                        }
                        className="mt-1 p-2 border w-full rounded"
                      />
                    )}
                  </div>
                ) : ""
              )}
              <div className="col-span-1 sm:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                >
                  {editingId ? "Update" : "Create"} Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-1 mb-2">Order List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs border mt-1">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Design</th>
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border text-wrap">Sales Person</th>
              <th className="p-2 border max-w-17">Ord Confirmation</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Availability</th>
              <th className="p-2 border">Ready Date</th>
              <th className="p-2 border">Delivery Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="p-2 border">
                  {moment(order.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="p-2 border">{order.design}</td>
                <td className="p-2 border">{order.size}</td>
                <td className="p-2 border">{order.qty}</td>
                <td className="p-2 border">{order.customername}</td>
                <td className="p-2 border">{order.location}</td>
                <td className="p-2 border">{order.salesman}</td>
                <td className="p-2 border">{order.orderconfirmation}</td>
                <td className="p-2 border">{order.remarks}</td>
                <td className="p-2 border">{order.availability}</td>
                <td className="p-2 border">
                  {moment(order.readydate).format("DD/MM/YYYY")}
                </td>
                <td className="p-2 border">
                  {moment(order.deliverydate).format("DD/MM/YYYY")}
                </td>
                <td className="border px-2  ">
                  <button
                    onClick={() => {
                      alert("On Working");
                    }}
                    // onClick={() => handleEdit(order)}
                    className="px-1"
                  >
                    <PackagePlus />
                  </button>

                  <button
                    onClick={() => handleEdit(order)}
                    className="px-1 text-green-500 "
                  >
                    <Pencil />
                  </button>
                  <button
                    // onClick={()=>{alert(order._id)}}
                    onClick={() => handleDelete(order._id)}
                    className="px-1 text-red-600"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
