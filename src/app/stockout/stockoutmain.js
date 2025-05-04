"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Client, Dealer, Breakage Page
import StockOutClientOrderForm from "./stockoutclient"
import StockOutDealerOrderForm from "./stockoutdealer"
import StockOutBreakageOrderForm from "./stockoutitem"


export default function StockOutTablePage() {
    const [stockOuts, setStockOuts] = useState([]);
    const [dealerOut, setDealerOut] = useState([]);
    const [clientOut, setClientOut] = useState([]);
    const [breakageOut, setBreakageOut] = useState([]);
    const [modaldealerOpen, setModalDealerOpen] = useState(false);
    const [modalclientOpen, setModalClientOpen] = useState(false);
    const [modalbreakageOpen, setModalBreakageOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const initialForm = {
        date: "",
        orderId: "",
        ordDate: "",
        name: "",
        mobile: "",
        gstNo: "",
        paymentMode: "",
        billAddress: "",
        delAddress: "",
        refBy: "",
        delDate: "",
        designName: "",
        coName: "",
        batchNo: "",
        size: "",
        weight: "",
        type: "",
        qty: "",
        salesPerson: "",
        pcPerBox: "",
        qtyPerSqft: "",
        qtyPerBox: "",
        pricePerBox: "",
        amount: "",
        outtag: "",
        location: "",
        currStock: "",
        createdBy: "",
    };
    const [formData, setFormData] = useState(initialForm);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/stockout")
            .then((res) => res.json())
            .then((data) => setStockOuts(data))
            .catch((err) => console.error(err));
    }, []);

    function openAddModal() {
        setIsEditing(false);
        setFormData(initialForm);
        setModalOpen(true);
    }
    function openAddModal() {
        setIsEditing(false);
        setFormData(initialForm);
        setModalOpen(true);
    }
    function openAddModal() {
        setIsEditing(false);
        setFormData(initialForm);
        setModalOpen(true);
    }

    function openEditModal(item) {
        setIsEditing(true);
        setCurrentItem(item);
        // map only the form fields
        const mapped = Object.fromEntries(
            Object.keys(initialForm).map((key) => [key, item[key] || ""])
        );
        setFormData(mapped);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setCurrentItem(null);
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this record?")) return;
        await fetch(`/api/stockout/${id}`, { method: "DELETE" });
        setStockOuts(stockOuts.filter((item) => item._id !== id));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            const res = await fetch(`/api/stockout/${currentItem._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const updated = await res.json();
            setStockOuts(
                stockOuts.map((item) => (item._id === updated._id ? updated : item))
            );
        } else {
            const res = await fetch("/api/stockout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const newItem = await res.json();
            setStockOuts([newItem, ...stockOuts]);
            // setStockOuts([newItem, ...stockOuts]);
            // setStockOuts([newItem, ...stockOuts]);
            // setStockOuts([newItem, ...stockOuts]);
        }
        closeModal();
    }

    // derive headers from initialForm keys
    const headers = Object.keys(initialForm);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-500"
                    onClick={() => router.push("/dashboard")}
                >
                    Back to Dashboard
                </button>
                <h1 className="text-2xl font-semibold">Stock Out Records</h1>
                <div className="space-x-2">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
                        onClick={openAddModal}
                    >
                        Dealer Stock Out
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
                        onClick={openAddModal}
                    >
                        Client Stock Out
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
                        onClick={openAddModal}
                    >
                        Breakage Out
                    </button>

                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            {headers.map((key) => (
                                <th
                                    key={key}
                                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                >
                                    {key}
                                </th>
                            ))}
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stockOuts.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50">
                                {headers.map((key) => (
                                    <td key={key} className="px-4 py-2 text-sm text-gray-800">
                                        {item[key]}
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-center text-sm space-x-1">
                                    <button
                                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-400"
                                        onClick={() => openEditModal(item)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? "Update" : "Add"} Stock Out
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            {headers.map((key) => (
                                <div key={key} className="flex flex-col">
                                    <label className="mb-1 capitalize text-gray-700">{key}</label>
                                    <input
                                        type="text"
                                        value={formData[key] || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, [key]: e.target.value })
                                        }
                                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                                >
                                    {isEditing ? "Save" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}