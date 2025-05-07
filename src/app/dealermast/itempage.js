"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Pencil, Trash2, PlusCircle, House, Link, Plus, PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";



export function itemOutPage() {
    const [dealerid, setdealerid] = useState("")
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

    {/* Modal */ }
    {
        showModal && (
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
        )
    }

}


