"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Pencil, Trash2, PlusCircle } from "lucide-react";

export default function TypeMastPage() {
    const [types, setTypes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ type: "", createdBy: "", status: "Active", id: null });
    const [status, setStatus] = useState(null);

    const fetchTypes = async () => {
        const res = await fetch("/api/typemast");
        const data = await res.json();
        setTypes(data);
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        try {
            const method = form.id ? "PUT" : "POST";
            const res = await fetch("/api/typemast", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await res.json();
            if (res.ok) {
                setStatus({ success: true, message: result.message });
                setForm({ type: "", createdBy: "", status: "Active", id: null });
                setModalOpen(false);
                fetchTypes();
            } else {
                setStatus({ success: false, message: result.message });
            }
        } catch {
            setStatus({ success: false, message: "Network error" });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure to delete this item?")) return;

        const res = await fetch("/api/typemast", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        const result = await res.json();
        if (res.ok) {
            fetchTypes();
        } else {
            alert(result.message);
        }
    };

    const openEdit = (item) => {
        setForm({ ...item, id: item._id });
        setModalOpen(true);
    };

    const openAdd = () => {
        setForm({ type: "", createdBy: "", status: "Active", id: null });
        setModalOpen(true);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Type Master</h1>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    <PlusCircle className="w-5 h-5" />
                    Add Type
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-4 overflow-auto">
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                            <th className="p-2">Type</th>
                            <th className="p-2">Created By</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Created At</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map((item) => (
                            <tr key={item._id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{item.type}</td>
                                <td className="p-2">{item.createdBy}</td>
                                <td className="p-2">{item.status}</td>
                                <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                                <td className="p-2 flex gap-2">
                                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline">
                                        <Pencil className="w-4 h-4 inline" />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">
                                        <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {types.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 p-4">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
                        <h2 className="text-xl font-bold mb-4">
                            {form.id ? "Edit Type" : "Add New Type"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Type</label>
                                <input
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-xl p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Created By</label>
                                <input
                                    value={form.createdBy}
                                    onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-xl p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl p-2"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                >
                                    {form.id ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                        {status && (
                            <div className={`mt-4 p-3 rounded-xl flex items-center space-x-2 ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {status.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                <span>{status.message}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
