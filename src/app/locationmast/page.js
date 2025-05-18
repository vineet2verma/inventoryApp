"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Pencil, Trash2, House, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginUserFunc } from "../context/loginuser";

export default function LocationMasterPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const { user } = LoginUserFunc();
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [rightread, setrightread] = useState(false);
  const [rightcreate, setrightcreate] = useState(false);
  const [rightedit, setrightedit] = useState(false);
  const [rightdelete, setrightdelete] = useState(false);
  const [form, setForm] = useState({
    location: "",
    createdBy: "",
    status: "Active",
  });

  const fetchData = async () => {
    const res = await fetch("/api/location");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setrightread(user.user?.plocation.includes("read"));
    setrightcreate(user.user?.plocation.includes("create"));
    setrightedit(user.user?.plocation.includes("update"));
    setrightdelete(user.user?.plocation.includes("delete"));
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/location", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (res.ok) {
      setStatusMsg({ success: true, message: result.message });
      setModalOpen(false);
      fetchData();
      setForm({ location: "", createdBy: "", status: "Active" });
    } else {
      setStatusMsg({ success: false, message: result.message });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this location?")) return;
    const res = await fetch("/api/location", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await res.json();
    setStatusMsg({ success: res.ok, message: result.message });
    fetchData();
  };

  const openEdit = (item) => {
    setForm({ ...item, id: item._id, createdBy: user.user?.name });
    setModalOpen(true);
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

            <h2 className="text-2xl font-bold text-gray-800">Location Master</h2>
            {rightcreate && (
              <button
                onClick={() => {
                  setForm({ location: "", createdBy: user.user?.name, status: "Active" });
                  setModalOpen(true);
                }}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                <Plus className="mr-2 w-5 h-5" />
                Add Location
              </button>
            )}
          </div>

          {statusMsg && (
            <div
              className={`mb-4 p-3 rounded-xl flex items-center space-x-2 ${statusMsg.success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {statusMsg.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span>{statusMsg.message}</span>
            </div>
          )}

          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl p-4">
            <table className="w-full table-auto text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Created By</th>
                  {/* <th className="px-4 py-2">Created At</th> */}
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="px-4 py-2">{item.location}</td>
                    <td className="px-4 py-2">{item.createdBy}</td>
                    <td className="px-4 py-2">{item.status}</td>
                    {/* <td className="px-4 py-2">
                  {new Date(item.createdAt).toLocaleString()}
                </td> */}
                    <td className="px-4 py-2 flex justify-center space-x-2">
                      {rightedit && (
                        <button
                          onClick={() => openEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {
                        rightdelete && (
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">
                  {form.id ? "Edit Location" : "Add Location"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Location</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      required
                      className="w-full p-2 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{form.id ? "Updated By " : " Created By"}</label>
                    <input
                      type="text"
                      disabled
                      value={form.createdBy}
                      onChange={(e) =>
                        setForm({ ...form, createdBy: user.user?.name })
                      }
                      required
                      className="w-full p-2 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-xl"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {form.id ? "Update" : "Create"}
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
