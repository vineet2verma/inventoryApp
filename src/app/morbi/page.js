"use client";
import { useEffect, useState } from "react";
import { socket } from "@/socket"; // "../socket";
import * as XLSX from "xlsx";
import moment from "moment";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  PackagePlus,
  House,
  TruckElectric,
} from "lucide-react";
import { LoginUserFunc } from "../context/loginuser";
import LoadingSpinner from "../components/waiting";
import Combobox from "../components/combobox_morbi";

export const dynamic = "force-dynamic"; // This page should always be revalidated

export default function MorbiOrderPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const router = useRouter();
  const { user } = LoginUserFunc();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rightread, setrightread] = useState(false);
  const [rightcreate, setrightcreate] = useState(false);
  const [rightedit, setrightedit] = useState(false);
  const [rightdelete, setrightdelete] = useState(false);

  const [orders, setOrders] = useState([]);
  const [finalfilter, setfinalfilter] = useState([]);
  const [showfilter, setshowfilter] = useState(false);
  const [sizearray, setsizearray] = useState([]);
  const [formData, setFormData] = useState({
    date: moment().format("YYYY-MM-DD h:mm a"),
    tilename: "",
    coname: "",
    size: "",
    qty: "",
    customername: "",
    location: "",
    salesman: user.user?.name,
    orderconfirmation: "Query",
    salesmanremarks: "",
    availability: "",
    readydate: "",
    transitdate: "",
    remarks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2open, setmodal2open] = useState(false);
  const [modaltransitopen, setmodaltransitopen] = useState(false);
  const [toast, setToast] = useState(null);
  const [action, setaction] = useState({});
  const [filters, setFilters] = useState({
    tilename: "",
    coname: "",
    size: "",
    customername: "",
    salesman: "",
    orderconfirmation: "All",
    availability: "All",
    transitdate: "All",
    // readydate: "",
  });

  const handleprev = () => {
    if (currentPage > 1) {
      setLoading(true);
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  };

  const handlenext = () => {
    if (totalPages > currentPage) {
      setLoading(true);
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  };

  const fetchOrders = async (page = currentPage) => {
    const res = await fetch(
      `/api/morbi?page=${currentPage}&limit=${itemsPerPage}`
    );
    const data = await res.json();
    // console.log(data);
    setOrders(data.records);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  function showNotification(title, options = {}) {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }
    // Request permission if needed
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    } else if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchOrders(currentPage);

    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("fetch-morbi-data", () => {
      fetchOrders(currentPage);

      showNotification("Hi !!", {
        body: "Data Update Sucessfully",
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [currentPage]);

  useEffect(() => {
    setrightread(user.user?.pmorbi.includes("read"));
    setrightcreate(user.user?.pmorbi.includes("create"));
    setrightedit(user.user?.pmorbi.includes("update"));
    setrightdelete(user.user?.pmorbi.includes("delete"));
  }, [user]);

  useEffect(() => {
    const filteredOrders = orders.filter((order) => {
      return Object.entries(filters).every(([key, value]) => {
        if (key === "transitdate") {
          if (value === "Blank") return !order.transitdate;
          if (value === "Non-Blank") return !!order.transitdate;
          return true;
        }
        if (key === "availability") {
          if (value === "All") return true;
          return (order[key] || "").toLowerCase() === value.toLowerCase();
        }
        if (key === "orderconfirmation") {
          if (value === "All") return true;
          return (order[key] || "").toLowerCase() === value.toLowerCase();
        }
        return value
          ? (order[key] || "")
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : true;
      });
    });
    setfinalfilter(filteredOrders);
  }, [filters, orders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const renderFilterInput = (key) => {
    if (key === "transitdate") {
      return (
        <select
          name={key}
          value={filters[key]}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        >
          <option value="All">All</option>
          <option value="Blank">Blank</option>
          <option value="Non-Blank">Non-Blank</option>
        </select>
      );
    } else if (key === "availability") {
      return (
        <select
          name={key}
          value={filters[key]}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        >
          <option value="All">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      );
    } else if (key === "orderconfirmation") {
      return (
        <select
          name={key}
          value={filters[key]}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        >
          <option value="All">All</option>
          <option value="Query">Query</option>
          <option value="Yes">Yes</option>
          <option value="Cancel">Cancel</option>
        </select>
      );
    } else {
      return (
        <input
          type="text"
          name={key}
          value={filters[key]}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        />
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handle2Change = (e) => {
    const { name, value } = e.target;
    setaction((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleOpen2modal = (
    id,
    availability,
    readydate,
    transitdate,
    remarks
  ) => {
    setaction({
      id,
      availability: availability || "Yes",
      readydate: readydate || "",
      remarks: remarks || "",
      transitdate: transitdate || "",
    });
    setmodal2open(true);
  };
  const handleOpen3modal = (
    id,
    availability,
    readydate,
    transitdate,
    remarks
  ) => {
    setaction({
      id,
      availability: availability || "Yes",
      readydate: readydate || "",
      remarks: remarks || "",
      transitdate: transitdate || "",
    });
    setmodaltransitopen(true);
  };

  const handle2Submit = async (e) => {
    e.preventDefault();
    // console.log('action', action)

    let newfilter = finalfilter.map((x) =>
      x._id === action.id
        ? {
            ...x,
            availability: action.availability,
            readydate: action.readydate,
            transitdate: action.transitdate,
            remarks: action.remarks,
          }
        : x
    );
    setfinalfilter(newfilter);
    let toupdate = newfilter.find((x) => x._id === action.id);
    const res = await fetch("/api/morbi/morbiaction", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toupdate),
    });
    const dt = await res.json();
    if (!dt.message) alert(dt.error);
    else alert(dt.message);
    setmodaltransitopen(false);
    setmodal2open(false);

    socket.emit("update-morbi", "true");

    // fetchOrders();
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNewOrder = (modalno) => {
    setFormData({
      date: moment().format("YYYY-MM-DD"),
      tilename: "",
      coname: "",
      size: "",
      qty: "",
      customername: "",
      location: "",
      salesman: user.user?.name,
      orderconfirmation: "Query",
      salesmanremarks: "",
      availability: "",
      readydate: "",
      transitdate: "",
      remarks: "",
    });
    modalno == "1" ? setModal1Open(true) : setModalOpen(true);
    // setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent double-click
    setSubmitting(true); // Start submitting
    const method = editingId ? "PUT" : "POST";

    const response = await fetch("/api/morbi", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      const text = await response.text(); // fallback in case it's not JSON
      console.error("API error:", text);
      showToast("Failed to save order");
      setSubmitting(false);
      return;
    }
    try {
      const data = await response.json(); // attempt to parse JSON
      // console.log("Response:", data);
    } catch (err) {
      console.warn("No JSON returned from Morbi API Check it"); // Not critical unless needed
    }

    socket.emit("update-morbi", "true");

    fetchOrders(currentPage);
    showToast(editingId ? "Order updated" : "Order created");
    setFormData({
      date: moment().format("YYYY-MM-DD"),
      tilename: "",
      coname: "",
      size: "",
      qty: "",
      customername: "",
      location: "",
      salesman: user.user?.name,
      orderconfirmation: "",
      salesmanremarks: "",
      availability: "",
      readydate: "",
      transitdate: "",
      remarks: "",
    });
    setEditingId(null);
    setModalOpen(false);
    setModal1Open(false);
    setSubmitting(false); // Done submitting
  };

  const handleEdit = (order) => {
    setFormData({
      ...order,
      date: moment(order.date).format("YYYY-MM-DD"),
      readydate: order.readydate
        ? moment(order.readydate).format("YYYY-MM-DD")
        : "",
    });
    setEditingId(order._id);
    setModal1Open(true);
  };

  const handleDelete = async (id, tilename) => {
    if (
      prompt(`Enter ${tilename.trim().toLowerCase()}  to confirm delete`).toLowerCase() ==
      tilename.trim().toLowerCase()
    ) {
      await fetch("/api/morbi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchOrders(currentPage);
      showToast("Order deleted", "error");
    } else showToast("Tile Name did not match", "error");
  };

  const handledownload = () => {
    exportTableToExcel(finalfilter);
  };

  const exportTableToExcel = (
    data,
    fileName = `Morbi_Orders ${moment(new Date()).format("DD-MM-YY h-mm a")}`
  ) => {
    const exportData = data.map((item) => ({
      Date: moment(item.createdAt).format("DD/MM/YY h:mm a"),
      TileName: item.tilename,
      CoName: item.coname,
      Size: item.size,
      Quantity: item.qty,
      Customer: item.customername,
      Location: item.location,
      SalesPerson: item.salesman,
      OrderConfirmation: item.orderconfirmation,
      SalesRemarks: item.salesmanremarks,
      Availability: item.availability,
      ReadyDate: item.readydate
        ? moment(item.readydate).format("DD/MM/YYYY")
        : "",
      TransitDate: item.transitdate
        ? moment(item.transitdate).format("DD/MM/YYYY")
        : "",
      Remarks: item.remarks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(dataBlob, `${fileName}.xlsx`);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        rightread && (
          <div className="p-4 w-screen h-[100vh] overflow-auto ">
            <div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 top-0 ">
                <div className="grid grid-cols-2 gap-2 ">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex justify-center items-center gap-2 text-xs px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full lg:max-w-[50%]  "
                  >
                    <House className="w-6 h-5" />
                    Home
                  </button>

                  <h1 className="text-2xl text-center font-bold ">Morbi</h1>
                </div>

                <div
                  className={
                    rightcreate
                      ? "grid grid-cols-1 md:flex gap-2 justify-end "
                      : "flex gap-2 rounded-xl justify-end "
                  }
                >
                  <div
                    className={
                      user.user.role == "admin" || user.user.name == "purchase"
                        ? "grid grid-cols-2 gap-2"
                        : "grid grid-cols-1 gap-2"
                    }
                  >
                    {(user.user.role == "admin" ||
                      user.user.name == "purchase") && (
                      <button
                        onClick={() => handledownload()}
                        className="bg-blue-600 text-white text-xs px-2 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                      >
                        Download
                      </button>
                    )}

                    <button
                      className="bg-blue-600 text-white text-xs px-2 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                      onClick={() => {
                        showfilter ? setshowfilter(false) : setshowfilter(true);
                      }}
                    >
                      {showfilter ? "Hide Filter" : "Show Filter"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {rightcreate && (
                      <button
                        onClick={() => handleNewOrder(0)}
                        className="bg-blue-600 text-white text-xs px-2 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                      >
                        + Design Mast
                      </button>
                    )}

                    {rightcreate && (
                      <button
                        onClick={() => handleNewOrder(1)}
                        className="bg-blue-600 text-white text-xs px-2 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                      >
                        + New Order
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {showfilter && (
                <div className="my-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(filters).map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium capitalize mb-1">
                        Filter by {key}
                      </label>
                      {renderFilterInput(key)}

                      {/* <label className="block text-sm font-medium capitalize mb-1">
                    Filter by {key}
                  </label> */}
                      {/* <input
                    type="text"
                    name={key}
                    value={filters[key]}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                  /> */}
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
                      className="absolute top-2 right-2 text-red-600 font-extrabold size-10 hover:text-red"
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
                      {[
                        "tilename",
                        "coname",
                        "size",
                        "qty",
                        "customername",
                        "location",
                        "orderconfirmation",
                        "salesmanremarks",
                      ].map((key) => (
                        <div key={key}>
                          <label className="block text-sm font-medium capitalize">
                            {key}
                          </label>
                          {key == "tilename" ? (
                            <Combobox
                              formData={formData}
                              setFormData={setFormData}
                              setsizearray={setsizearray}
                            />
                          ) : key == "coname" ? (
                            <input
                              type="text"
                              name={key}
                              required={key !== "coname"}
                              value={formData[key]}
                              onChange={handleChange}
                              className="mt-1 p-2 border w-full rounded"
                            />
                          ) : key == "size" ? (
                            <select
                              name={key}
                              onChange={handleChange}
                              className="mt-1 p-2 border w-full rounded"
                            >
                              <option value="">Select Size</option>
                              {sizearray.map((size, index) => (
                                <option key={index} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          ) : key == "qty" ? (
                            <input
                              type={key.includes("qty") ? "number" : "text"}
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              required={key !== "salesmanremarks"}
                              className="mt-1 p-2 border w-full rounded"
                            />
                          ) : key == "orderconfirmation" ? (
                            <select
                              type="text"
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              className="mt-1 p-2 border w-full rounded"
                            >
                              <option value="Flow Up">Query</option>
                              <option value="Yes">Yes</option>
                              <option value="Cancel">Cancel</option>
                            </select>
                          ) : (
                            <input
                              type={key.includes("date") ? "date" : "text"}
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              required={key !== "salesmanremarks"}
                              className="mt-1 p-2 border w-full rounded"
                            />
                          )}
                        </div>
                      ))}
                      <div className="col-span-1 sm:col-span-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                        >
                          {editingId ? "Update" : "Create"} Order
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {modal1Open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
                  <div className="bg-white p-6 rounded shadow-lg w-[95%] sm:w-[90%] max-w-4xl relative">
                    <button
                      onClick={() => {
                        setModal1Open(false);
                        setEditingId(null);
                      }}
                      className="absolute top-2 right-2 text-red-600 font-extrabold size-10 hover:text-red"
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
                        key != "date" &&
                        key != "createdAt" &&
                        key != "updatedAt" &&
                        key != "__v" &&
                        key != "availability" &&
                        key != "readydate" &&
                        key != "transitdate" &&
                        key != "salesman" &&
                        key != "deliverydate" &&
                        key != "remarks" ? (
                          <div key={key}>
                            <label className="block text-sm font-medium capitalize">
                              {key}
                            </label>
                            {key == "qty" ? (
                              <input
                                type={key.includes("qty") ? "number" : "text"}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                required={key !== "salesmanremarks"}
                                className="mt-1 p-2 border w-full rounded"
                              />
                            ) : key == "orderconfirmation" ? (
                              <select
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="mt-1 p-2 border w-full rounded"
                              >
                                <option value="Flow Up">Query</option>
                                <option value="Yes">Yes</option>
                                <option value="Cancel">Cancel</option>
                              </select>
                            ) : (
                              <input
                                type={key.includes("date") ? "date" : "text"}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                required={
                                  key !== "salesmanremarks" &&
                                  key !== "coname" &&
                                  key !== "orderconfirmation"
                                }
                                className="mt-1 p-2 border w-full rounded"
                              />
                            )}
                          </div>
                        ) : (
                          ""
                        )
                      )}
                      <div className="col-span-1 sm:col-span-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                        >
                          {editingId ? "Update" : "Create"} Order
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal Action Form */}
              {modal2open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-center items-start pt-10 z-50 overflow-y-auto">
                  <div className="bg-white px-6 py-2 rounded shadow-lg w-[95%] sm:w-[30%] relative">
                    <button
                      onClick={() => {
                        setmodal2open(false);
                      }}
                      className="absolute top-2 right-4 font-extrabold text-red-600 hover:text-red"
                    >
                      ✕
                    </button>
                    <h2 className="text-lg font-bold mb-4">Action Form</h2>
                    <form
                      onSubmit={handle2Submit}
                      className="grid grid-cols-1 gap-y-10"
                    >
                      <div>
                        <label className="block text-sm my-2 font-medium capitalize">
                          Availability
                        </label>
                        <select
                          type="text"
                          name="availability"
                          value={action.availability}
                          onChange={handle2Change}
                          className="mt-1 p-2 my-2 border w-full rounded"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label className="block text-sm my-2 font-medium capitalize">
                          Ready Date
                        </label>
                        <input
                          type="date"
                          name="readydate"
                          value={action.readydate}
                          onChange={handle2Change}
                          required
                          className="mt-1 p-2 my-2 border w-full rounded"
                        />
                        <label className="block text-sm my-2 font-medium capitalize">
                          Remarks
                        </label>
                        <input
                          type="text"
                          name="remarks"
                          value={action.remarks}
                          onChange={handle2Change}
                          required
                          className="mt-1 p-2 border w-full rounded"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <button
                          type="submit"
                          onClick={handle2Submit}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                        >
                          Action Form
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal Transit */}
              {modaltransitopen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-center items-start pt-10 z-50 overflow-y-auto">
                  <div className="bg-white px-6 py-2 rounded shadow-lg w-[95%] sm:w-[30%] relative">
                    <button
                      onClick={() => setmodaltransitopen(false)}
                      className="absolute top-2 right-4 font-extrabold text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                    <h2 className="text-lg font-bold mb-4">Transit Action</h2>
                    <form
                      onSubmit={handle2Submit}
                      className="grid grid-cols-1 gap-y-10"
                    >
                      <div>
                        <label className="block text-sm my-2 font-medium capitalize">
                          Transit Date
                        </label>
                        <input
                          type="date"
                          name="transitdate"
                          value={action.transitdate}
                          onChange={handle2Change}
                          className="mt-1 p-2 my-2 border w-full rounded"
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                        >
                          Transit Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* <h2 className="text-xl font-semibold mt-1 mb-0">Order List</h2> */}
              <div className="overflow-auto max-h-[500px] border mt-2">
                <table className="w-full border-collapse text-xs border  ">
                  <thead className="overflow-auto  ">
                    <tr className="bg-gray-100 ">
                      <th className="p-2 border bg-gray-600 text-white  sticky top-0 z-10">
                        Date
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Tile Name
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Co Name
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Size
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0">
                        Qty
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Customer
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Location
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Sales Person
                      </th>
                      <th className="px-1 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Ord Confirm
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap ">
                        S.Person Remarks
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0">
                        Availability
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0">
                        Ready Date
                      </th>
                      {/* <th className="p-2 border bg-gray-600 text-white sticky top-0">Delivery Date</th> */}
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        In Transit
                      </th>
                      {/* transitdate */}
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Remarks
                      </th>
                      <th className="p-2 border bg-gray-600 text-white sticky top-0 text-wrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {finalfilter.map((order, index) => (
                      <tr
                        key={order._id}
                        className={`text-center border odd:bg-gray-200 even:bg-white `}
                      >
                        <td className="px-0.5 py-2 border text-xs text-wrap ">
                          {moment(order.createdAt).format("DD/MM/YY h:mm a")}
                        </td>
                        <td className="p-2 border text-wrap">
                          {order.tilename}
                        </td>
                        <td className="p-2 border text-wrap text-xs">{order.coname}</td>
                        <td className="p-2 border text-wrap text-xs">{order.size}</td>
                        <td className="p-2 border text-wrap text-xs">{order.qty}</td>
                        <td className="p-2 border text-wrap text-xs">
                          {order.customername}
                        </td>
                        <td className="p-2 border text-wrap text-xs">
                          {order.location}
                        </td>
                        <td className="p-2 border text-wrap text-xs">
                          {order.salesman}
                        </td>
                        <td className="px-0 border text-wrap text-xs">
                          {order.orderconfirmation}
                        </td>
                        <td className="p-2 border text-wrap text-xs">
                          {order.salesmanremarks}
                        </td>
                        <td className="p-2 border text-wrap text-xs">
                          {order.availability}
                        </td>

                        <td className="p-2 border text-xs">
                          {order.readydate
                            ? moment(order.readydate).format("DD/MM/YYYY")
                            : ""}
                        </td>
                        <td className="p-2 border text-xs">
                          {order.transitdate
                            ? moment(order.transitdate).format("DD/MM/YYYY")
                            : ""}
                        </td>
                        <td className="p-2 border text-wrap text-xs">
                          {order.remarks}
                        </td>

                        <td className=" items-center text-wrap text-xs px-2 py-2 flex ">
                          {(user.user?.role == "admin" ||
                            (user.user?.role == "purchase" &&
                              order.readydate == "") && order.orderconfirmation!="Cancel" ) && (
                            <button
                              onClick={() => {
                                handleOpen2modal(
                                  order._id,
                                  order.availability,
                                  order.readydate,
                                  order.transitdate,
                                  order.remarks
                                );
                              }}
                              className="px-1 "
                            >
                              <PackagePlus />
                            </button>
                          )}

                          {(rightedit && order.transitdate == "" && order.orderconfirmation!='Cancel' && user.user.name==order.salesman ) && (
                            <button
                              onClick={() => handleEdit(order)}
                              className="px-1 text-green-500 "
                            >
                              <Pencil />
                            </button>
                          )}

                          {order.readydate != "" &&
                            ((user.user?.role == "admin" ||
                              user.user?.role == "purchase") &&
                                order.transitdate == "") && (
                              <button
                                onClick={() => {
                                  handleOpen3modal(
                                    order._id,
                                    order.availability,
                                    order.readydate,
                                    order.transitdate,
                                    order.remarks
                                  );
                                }}
                                className="px-1  text-green-900 "
                              >
                                <TruckElectric />
                              </button>
                            )}
                          {rightdelete && (
                            <button
                              // onClick={()=>{alert(order._id)}}
                              onClick={() =>
                                handleDelete(order._id, order.tilename)
                              }
                              className="px-1  text-red-600"
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
            </div>
            {/* Page Number Buttons */}
            <div className="flex justify-between px-5 items-center max-w-100 m-auto mt-5">
              <button
                disabled={loading || currentPage <= 1}
                className="bg-yellow-500 px-5 py-2 rounded-2xl border-1"
                onClick={() => {
                  handleprev();
                }}
              >
                Prev
              </button>
              <p>
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </p>
              <button
                disabled={loading || currentPage >= totalPages}
                className="bg-green-500 px-5 py-2 rounded-2xl border-1"
                onClick={() => {
                  handlenext();
                }}
              >
                Next
              </button>
            </div>
          </div>
        )
      )}
    </>
  );
}
