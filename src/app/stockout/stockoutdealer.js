"use client";

import { useState } from "react";
import { useDealer } from "../context/delaercontext";
import { useDealerItems } from "../context/dealeritem";
import { CheckCircle, XCircle, Pencil, Trash2, House, Plus } from "lucide-react";

export default function StockOutDealerOrderForm() {
    const { dealer, setDealer } = useDealer();
    const { dealerItems, setDealerItems } = useDealerItems();
    const [showModal, setShowModal] = useState(false);
    const [itemData, setItemData] = useState({
        designName: "",
        coName: "",
        batchNo: "",
        size: "",
        qty: "",
        salePerson: "",
        PricePerBox: "",
        outtag: "",
    });

    const handleDealerChange = (e) => {
        const { name, value } = e.target;
        setDealer((prev) => ({ ...prev, [name]: value }));
    };
    const handleDelete = (index) => {
        setDealerItems((prev) => prev.filter((_, i) => i !== index))
    }

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setItemData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...dealer,
            items: dealerItems,
        };
        console.log("Final Submit:", finalData);
        alert("Submitted! Check console for full payload.");
    };

    const handleAddItem = () => {
        setDealerItems((prev) => [...prev, itemData]);
        console.log(dealerItems)
        setShowModal(false);
        setItemData({
            designName: "",
            coName: "",
            batchNo: "",
            size: "",
            qty: "",
            salePerson: "",
            PricePerBox: "",
            outtag: "",
        });
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4 text-sm"
            >
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Dealer Order Form</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["date", "orderId", "ordDate", "name", "mobile", "gstNo", "paymentMode", "refBy", "delDate"].map((field, idx) => (
                        <div key={idx}>
                            <label className="block mb-1 capitalize text-gray-600">{field}</label>
                            <input
                                type={field.includes("date") ? "date" : "text"}
                                name={field}
                                value={dealer[field] || ""}
                                onChange={handleDealerChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block mb-1 text-gray-600">Billing Address</label>
                    <textarea
                        name="billAddress"
                        value={dealer.billAddress || ""}
                        onChange={handleDealerChange}
                        rows={2}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-600">Delivery Address</label>
                    <textarea
                        name="delAddress"
                        value={dealer.delAddress || ""}
                        onChange={handleDealerChange}
                        rows={2}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Add Item
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>

                {/* Items Preview Table */}
                {dealerItems.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Added Items</h3>
                        <div className="overflow-auto">
                            <table className="w-full text-sm text-left border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {["Design", "Company", "Batch", "Size", "Qty", "Sales", "Price", "Tag", "Action"].map((h, i) => (
                                            <th key={i} className="px-3 py-2 border">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dealerItems.map((item, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="px-3 py-1 border">{item.designName}</td>
                                            <td className="px-3 py-1 border">{item.coName}</td>
                                            <td className="px-3 py-1 border">{item.batchNo}</td>
                                            <td className="px-3 py-1 border">{item.size}</td>
                                            <td className="px-3 py-1 border">{item.qty}</td>
                                            <td className="px-3 py-1 border">{item.salePerson}</td>
                                            <td className="px-3 py-1 border">{item.PricePerBox}</td>
                                            <td className="px-3 py-1 border">{item.outtag}</td>
                                            <td className="px-3 py-1 border">
                                                <button
                                                    onClick={() => handleDelete(idx)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </form>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 text-sm">
                        <h3 className="text-lg font-semibold mb-4">Add Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["designName", "coName", "batchNo", "size", "qty", "salePerson", "outtag", "PricePerBox"].map((field, idx) => (
                                <div key={idx}>
                                    <label className="block mb-1 capitalize text-gray-600">{field}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={itemData[field]}
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
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
