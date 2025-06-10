"use client";
import {
  Pencil,
  Trash2,
  X,
  GripVertical,
  RefreshCcw,
  FileUser,
  ArrowBigLeft,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import InfoCard from "@/app/components/card_component";
import InfoCardInput from "../components/card_input";
import { LoginUserFunc } from "../context/loginuser";
import moment from "moment";
//
export default function CRMClientPage() {
  const user = LoginUserFunc();
  const [viewdetail, setviewdetail] = useState({});
  const [sections, setSections] = useState({});

  const [isEditable, setIsEditable] = useState(false); //card input button state
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalview, setmodalview] = useState(false);
  const [modalfollowup, setmodalfollowup] = useState(false);
  const [followuptab, setfollowuptab] = useState(true);
  const [modaldelete, setmodaldelete] = useState(false);
  const submenuRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    salesperson: "",
    followupstage: "",
    nextfollowdate: "",
    search: "",
  });
  const columns = [
    "date",
    "name",
    "mobile",
    "querytype",
    "salesperson",
    "nextfollowdate",
    "followupstage",
    "referencetype",
  ];

  const handleCurrentrow = (index, itemarray) => {
    console.log("index => ", index);
    console.log("itemarray => ", itemarray);

    const mergedSections = [
      [
        {
          key: "name",
          subtitle: "Name",
          detail: itemarray.name,
        },
        {
          key: "email",
          subtitle: "Email",
          detail: "abc@gmail.com",
        },
        {
          key: "mobile",
          subtitle: "Mob",
          detail: itemarray.mobile,
        },
      ],
      [
        {
          key: "companyname",
          subtitle: "Company",
          detail: "Abc Ltd",
        },
        {
          key: "query",
          subtitle: "Query",
          detail: itemarray.querytype,
        },
        {
          key: "potential",
          subtitle: "Potential",
          detail: "N/a",
        },
      ],
      [
        {
          key: "companyname",
          subtitle: "Company",
          detail: "Abc Ltd",
        },
        {
          key: "query",
          subtitle: "Query",
          detail: "Price Quota",
        },
        {
          key: "potential",
          subtitle: "Potential",
          detail: "N/a",
        },
      ],
      [
        {
          key: "",
          subtitle: "Follow Up Stage",
          detail: viewdetail.followupstage,
        },
        {
          key: "",
          subtitle: "Reference Type",
          detail: viewdetail.referencetype,
        },
        {
          key: "",
          subtitle: "Last Contact",
          detail: "N/a",
        },
      ],
    ];

    setSections(mergedSections);
    setOpenMenuIndex(openMenuIndex === index ? null : index);
    setviewdetail(itemarray);
  };

  const handleprev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchData(newPage);
    }
  };

  const handlenext = () => {
    if (totalPages > currentPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchData(newPage);
    }
  };

  const fetchData = async (currentPage) => {
    const res = await fetch(
      `/api/crmclient?page=${currentPage}&limit=${itemsPerPage}`
    );
    const json = await res.json();
    if (json.success) setData(json.data);
    setTotalPages(json.totalPages);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setmodalview(false);
    setmodalfollowup(false);
    setmodaldelete(false);

    if (activeModal === "view Details") {
      setmodalview(true);
      setmodalfollowup(false);
      setmodaldelete(false);
    }
    if (activeModal === "Follow Up") {
      setmodalfollowup(true);
      setmodalview(false);
      setmodaldelete(false);
    }
    if (activeModal === "Delete") {
      setmodaldelete(true);
      setmodalview(false);
      setmodalfollowup(false);
    }
  }, [activeModal]);

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const handletypeChange = (e) => {
    setviewdetail({ ...viewdetail, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const payload = editingId ? { ...form, _id: editingId } : form;

    const res = await fetch("/api/crmclient", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm({});
      setEditingId(null);
      setShowForm(false);
      fetchData(currentPage);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are You Sure Want to Delete ?? ")) {
      const res = await fetch(`/api/crmclient?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData(currentPage);
    }
  };

  const handleCancel = () => {
    setForm({});
    setEditingId(null);
    setShowForm(false);
  };

  const openModal = (type) => {
    setActiveModal(type);
    setOpenMenuIndex(null);
  };

  const closeModal = () => setActiveModal(null);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = data.filter((item) => {
    const matchesSalesperson =
      !filters.salesperson ||
      item.salesperson
        ?.toLowerCase()
        .includes(filters.salesperson.toLowerCase());
    const matchesFollowupStage =
      !filters.followupstage ||
      item.followupstage
        ?.toLowerCase()
        .includes(filters.followupstage.toLowerCase());
    const matchesNextFollowDate =
      !filters.nextfollowdate ||
      item.nextfollowdate
        ?.toLowerCase()
        .includes(filters.nextfollowdate.toLowerCase());
    const matchesSearch =
      !filters.search ||
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(filters.search.toLowerCase())
      );

    return (
      matchesSalesperson &&
      matchesFollowupStage &&
      matchesNextFollowDate &&
      matchesSearch
    );
  });

  async function handleviewsave() {
    console.log("updated section data", viewdetail);

    const req = await fetch("/api/crmclient", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(viewdetail),
    });

    const resp = await req.json();

    fetchData();

    if (resp.success) {
      alert("Data Updated Sucessfully");
    }
  }

  return (
    <div className="m-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="grid grid-cols-2 gap-2">
          <h1 className="text-2xl font-bold">CRM Client Master</h1>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Show Filter
          </button>
          <button
            onClick={() => {
              setForm({});
              setShowForm(true);
              setEditingId(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create New
          </button>
        </div>
      </div>
      {/* Filters */}
      {showFilter && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="search"
            placeholder="Search all..."
            value={filters.search}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="salesperson"
            placeholder="Filter by Salesperson"
            value={filters.salesperson}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="followupstage"
            placeholder="Filter by Followup Stage"
            value={filters.followupstage}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="nextfollowdate"
            placeholder="Filter by Next Follow Date"
            value={filters.nextfollowdate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
        </div>
      )}
      {/* Table */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200 text-gray-800">
            <tr className="bg-gray-700 text-white">
              <th className="border px-3 py-2 text-center">#</th>
              {columns.map((col) => (
                <th key={col} className="border px-3 py-2 text-center">
                  {col.toUpperCase()}
                </th>
              ))}
              <th className="border px-3 py-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 text-center relative odd: bg-gray-200 even:bg-white "
                >
                  <td key={index} className="border px-3 py-2">
                    {index + 1}
                  </td>

                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-2">
                      {item[col] || ""}
                    </td>
                  ))}
                  <td className="border px-3 py-2 relative">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleCurrentrow(index, item)}
                        className="text-blue-600"
                      >
                        <GripVertical size={16} />
                      </button>
                      {/* <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600"
                      >
                        <Pencil size={16} />
                      </button> */}
                    </div>

                    {openMenuIndex === index && (
                      <div
                        ref={submenuRef}
                        className="absolute right-0 mt-1 w-36 bg-white border shadow rounded z-20"
                      >
                        <button
                          onClick={() => openModal("view Details")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <div className="flex">
                            <FileUser size={16} className="mx-2" />
                            view Details
                          </div>
                        </button>
                        <button
                          onClick={() => openModal("Follow Up")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <div className="flex">
                            <RefreshCcw size={16} className="mx-2" />
                            Follow Up
                          </div>
                        </button>

                        {user.user.role == "admin" && (
                          <button
                            onClick={() => {
                              handleDelete(item._id);
                            }}
                            // onClick={() => openModal("Delete")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <div className="flex">
                              <Trash2 size={16} className="mx-2" />
                              Delete
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* CRUD Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-2 rounded-lg w-full max-w-4xl relative">
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 text-gray-500"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Client" : "Add New Client"}
            </h2>
            <div className="max-h-[80vh] overflow-auto p-4">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {[
                  "date",
                  "name",
                  "email",
                  "mobile",
                  "companyname",
                  "querytype",
                  "remarks",
                  "salesperson",
                  "nextfollowdate",
                  "followupstage",
                  "protentialvalue",
                  "referencetype",
                ].map((col) => (
                  <div key={col} className="flex flex-col">
                    <label className="mb-1 text-xs font-medium capitalize">
                      <strong>{col}</strong>
                    </label>
                    {col == "date" || col == "nextfollowdate" ? (
                      <input
                        name={col}
                        type="date"
                        value={form[col] || ""}
                        onChange={handleChange}
                        className="p-2 border rounded"
                      />
                    ) : col == "mobile" || col == "protentialvalue" ? (
                      <input
                        name={col}
                        type="number"
                        min={0}
                        max={999999999}
                        value={form[col] || ""}
                        onChange={handleChange}
                        className="p-2 border rounded"
                      />
                    ) : col == "querytype" ? (
                      <select>
                        <option disabled>Select Query</option>
                        {[
                          "Query One",
                          "Query Two",
                          "Query Three",
                          "Query Four",
                        ].map((item, index) => (
                          <option value={item}>{item}</option>
                        ))}
                      </select>
                    ) : col == "salesperson" ? (
                      <select>
                        <option disabled>Select Query</option>
                        {[
                          "Sales One",
                          "Sales Two",
                          "Sales Three",
                          "Sales Four",
                        ].map((item, index) => (
                          <option value={item}>{item}</option>
                        ))}
                      </select>
                    ) : col == "followupstage" ? (
                      <select>
                        <option disabled>Select Query</option>
                        {["Initial Contact", "Proposal", "Negotiation"].map(
                          (item, index) => (
                            <option value={item}>{item}</option>
                          )
                        )}
                      </select>
                    ) : (
                      <input
                        name={col}
                        value={form[col] || ""}
                        onChange={handleChange}
                        className="p-2 border rounded"
                      />
                    )}
                  </div>
                ))}
                <div className="col-span-full flex justify-end gap-3 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modals */}
      {["view Details", "Follow Up", "Delete"].includes(activeModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <div className="flex justify-between  ">
              <h2 className="text-xl font-semibold ">
                {activeModal.toUpperCase()}
              </h2>
              <div className="flex">
                {modalview && (
                  <button
                    className="px-2 text-xs"
                    onClick={() => {
                      setIsEditable(!isEditable);
                    }}
                  >
                    <div className="flex border bg-gray-100 items-center px-3 py-1 rounded-sm ">
                      {isEditable ? (
                        <X size={16} className="mx-2 text-red-500" />
                      ) : (
                        <Pencil size={16} className="mx-1" />
                      )}
                      {isEditable ? "Cancel" : "Edit"}
                    </div>
                  </button>
                )}
                {(isEditable || activeModal == "Follow Up") && (
                  <button
                    className="border bg-gray-100 items-center px-3 py-0 text-xs rounded-sm "
                    onClick={() => {
                      handleviewsave(viewdetail._id);
                    }}
                  >
                    Save
                  </button>
                )}

                <button
                  className=" px-2 text-xs "
                  onClick={() => {
                    closeModal();
                  }}
                >
                  <div className="flex border bg-gray-100 items-center px-3 py-1 rounded-sm ">
                    <ArrowBigLeft size={14} className="mx-1" />
                    Back
                  </div>
                </button>
              </div>
            </div>
            {/* Modal View Detail */}
            {modalview && (
              // <div className="w-full h-[80vh] overflow-auto px-2">
              // className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 "
              <div className="w-full h-[80vh] overflow-auto px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                  <InfoCardInput
                    title={"Personal Detail"}
                    sections={sections}
                    editable={isEditable}
                    setSections={setSections}
                    data={viewdetail}
                    id={0}
                    setviewdetail={setviewdetail}
                    width="w-[200px]"
                    border="0"
                  />
                  <InfoCardInput
                    title={"Company Info"}
                    sections={sections}
                    setSections={setSections}
                    id={1}
                    width="w-[200px]"
                    border="0"
                    editable={isEditable}
                    data={viewdetail}
                    setviewdetail={setviewdetail}
                  />
                  <InfoCard
                    // id={2}
                    title={"Lead Info"}
                    sections={[
                      {
                        "Lead Type": viewdetail.leadtype,
                      },
                      {
                        "Follow Up Stage": viewdetail.followupstage,
                      },
                      {
                        "Sales Person": viewdetail.salesperson,
                      },
                      {
                        "Reference Type": viewdetail.referencetype,
                      },
                      {
                        "Next Follow Up": `${viewdetail.nextfollowdate}  ${
                          viewdetail.nextfollowtime || ""
                        } `,
                      },
                      {
                        "Last Contact": "N/a",
                      },
                    ]}
                    width="w-[400px]"
                    border="2"
                  />
                </div>
              </div>
            )}

            {/* Modal Follow Up */}
            {modalfollowup && (
              <div className="grid grid-cols-1 gap-2 ">
                <newline />
                <p className="px-2 bg-gray-200 text-black font-semibold max-w-full">
                  Lead Type
                </p>
                <div className="flex justify-around">
                  {["Hot", "Warm", "Cold"].map((item) => (
                    <label>
                      <input
                        name="leadtype"
                        className="mx-2"
                        defaultChecked={item.leadtype}
                        type="radio"
                        value={item}
                        onChange={handletypeChange}
                      />
                      {item}
                    </label>
                  ))}
                </div>
                <div>
                  <div className=" grid grid-cols-2 gap-2">
                    <button
                      className={`px-2 ${
                        followuptab ? "bg-gray-200" : ""
                      } border rounded`}
                      onClick={() => {
                        setfollowuptab(true);
                      }}
                    >
                      <strong>Schedule Follow Up</strong>
                    </button>

                    <button
                      className={`px-2 ${
                        !followuptab ? "bg-gray-200" : ""
                      }  border rounded`}
                      onClick={() => {
                        setfollowuptab(false);
                      }}
                    >
                      <strong>Lead Clossing...</strong>
                    </button>
                  </div>

                  {followuptab && (
                    <div>
                      <h4 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Follow Up Stage
                      </h4>
                      <div className="flex justify-around">
                        {["Initial Contact", "Proposal", "Negotiation"].map(
                          (item) => (
                            <label>
                              <input
                                name="followupstage"
                                className="mx-2"
                                type="radio"
                                value={item}
                                onChange={handletypeChange}
                              />
                              {item}
                            </label>
                          )
                        )}
                      </div>
                      <h6 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Follow Up Date & Time
                      </h6>
                      <div className="flex justify-between my-2">
                        <input
                          type="date"
                          name="nextfollowdate"
                          onChange={handletypeChange}
                          className="my-1 px-2"
                        />
                        <input
                          type="time"
                          name="nextfollowtime"
                          onChange={handletypeChange}
                          className="my-1"
                        />
                      </div>
                      <h6 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Follow Up Type
                      </h6>
                      <div>
                        <select
                          name="followupType"
                          className="my-2 w-full px-2 border rounded py-1"
                          onChange={handletypeChange}
                        >
                          {["Call", "Whatapp", "Email"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <h6 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Remarks
                      </h6>
                      <div>
                        <textarea
                          className="my-2 px-2 border w-full rounded-xl"
                          name="remarks"
                          rows={3}
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {!followuptab && (
                    <div>
                      <h4 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Closing Stage
                      </h4>
                      <div className="flex justify-around">
                        {["Closing Won", "Closing Lost"].map((item) => (
                          <label>
                            <input
                              name="status"
                              className="mx-2"
                              type="radio"
                              value={item}
                              onChange={handletypeChange}
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                      <h4 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Closing Reason
                      </h4>
                      <div>
                        <select
                          name="closingreason"
                          className="my-2 w-full px-2 border rounded py-1"
                          onChange={handletypeChange}
                        >
                          {[
                            "Deal Won",
                            "Budget Constraints",
                            "Competitor Selected",
                            "No Response",
                            "Not Interested",
                            "Other",
                          ].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <h4 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Closing Amount
                      </h4>
                      <div>
                        <input
                          className="my-2 px-2 border w-full rounded-xl"
                          name="remarks"
                          rows={3}
                        ></input>
                      </div>
                      <h4 className="font-semibold my-2 bg-gray-200 px-2 max-w-full">
                        Closing Remarks / Notes
                      </h4>

                      <div>
                        <textarea
                          className="my-2 px-2 border w-full rounded-xl"
                          name="closingRemarks"
                          rows={3}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-2 px-2 text-xs"></div>
          </div>
        </div>
      )}
      {/* Page Number Buttons */}
      <div className="flex justify-between px-5 items-center max-w-100 m-auto mt-5">
        <button
          className="bg-yellow-500 px-5 py-2 rounded-2xl border-1"
          onClick={() => {
            handleprev();
          }}
        >
          Prev
        </button>
        <p>
          <strong>{currentPage}</strong>
        </p>
        <button
          className="bg-green-500 px-5 py-2 rounded-2xl border-1"
          onClick={() => {
            handlenext();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
