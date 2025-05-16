"use client";
import {
    Trash2,
} from "lucide-react";

import DesignComboBox from "../components/combobox";

{/* Modal for add item */ }
export default function Itemdetailfunc({ initialitem, setintialitem, selecteddesignname, setselecteddesignname, sz, setsize, batchno, setbatchno, cnames, setcnames, handleItemChange, handleitemdelete, invmast, setinvmast, handleAddItem, itemData, setItemData, showModal, setShowModal, selectedSize, setSelectedSize }) {

    return (
        /* <form> */
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 text-sm">
                <h3 className="text-lg font-semibold mb-4">Add Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "date",
                        "mid",
                        "midname",
                        "designname",
                        "size",
                        "batchno",
                        "coname",
                        "qty",
                        "outtag",
                    ].map((field, idx) =>
                        field == "date" ? (
                            <div key={idx}>
                                <label className="block mb-1 capitalize text-gray-600">
                                    {field}
                                </label>
                                <input
                                    type="date"
                                    name={field}
                                    value={initialitem[field]}
                                    onChange={handleItemChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ) : field == "designname" ? (
                            <div key={idx}>
                                <label className=" block mb-1 capitalize text-gray-600">
                                    {field}
                                </label>
                                <DesignComboBox
                                    onSelect={setselecteddesignname}
                                    itemChange={handleItemChange}
                                    changedSize={setsize}
                                    cs={setintialitem}
                                    ii={initialitem}
                                    changedBatch={setbatchno}

                                    inv={setinvmast}
                                    invdt={invmast}
                                    cn={setcnames}
                                    sdesign={selecteddesignname}
                                />
                            </div>
                        ) : field == "size" ? (
                            <div key={idx}>
                                <label className="block mb-1 capitalize text-gray-600">
                                    {field}
                                </label>
                                <select
                                    type="text"
                                    name={field}
                                    value={initialitem[field]}
                                    onChange={handleItemChange}
                                    className="w-full p-2 border rounded"
                                >
                                    {sz.map((item, i) => (
                                        <option key={i} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : field == "batchno" ? (
                            <div key={idx}>
                                <label className="block mb-1 capitalize text-gray-600">
                                    {field}
                                </label>
                                <select
                                    type="text"
                                    name={field}
                                    value={initialitem[field]}
                                    onChange={handleItemChange}
                                    className="w-full p-2 border rounded"
                                >
                                    {batchno.map((item, i) => (
                                        <option key={i} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : field == "outtag" ? (
                            <div key={idx}>
                                <label className="block mb-1 capitalize text-gray-600">
                                    {field}
                                </label>
                                <select
                                    disabled
                                    type="text"
                                    name={field}
                                    value={initialitem[field]}
                                    onChange={handleItemChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="Hold">Hold</option>
                                    <option value="Out">Out</option>
                                </select>
                            </div>
                        ) :
                            field == "coname" ? (
                                <div key={idx}>
                                    <label className="block mb-1 capitalize text-gray-600">
                                        {field}
                                    </label>
                                    <input
                                        type="text"

                                        name={field}
                                        value={cnames}
                                        onChange={handleItemChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            ) : (
                                <div key={idx}>
                                    <label className="block mb-1 capitalize text-gray-600">
                                        {field}
                                    </label>
                                    <input
                                        type={field == "qty" ? "number" : "text"}
                                        disabled={
                                            field == "mid" || field == "midname" ? true : false
                                        }
                                        name={field}
                                        value={initialitem[field]}
                                        onChange={handleItemChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            )
                    )}
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
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                        Added Items
                    </h3>
                    <div className="overflow-auto">
                        <table className="w-full text-sm text-left border">
                            <thead className="bg-gray-100">
                                <tr>
                                    {[
                                        "Date",
                                        "Mid Name",
                                        "Design",
                                        "Company",
                                        "Batch",
                                        "Size",
                                        "Qty",
                                        "Createdby",
                                        "Tag",
                                        "Action",
                                    ].map((h, i) => (
                                        <th key={i} className="px-3 py-2 border">
                                            {h}
                                        </th>
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
                                        <td className="px-3 py-1 border">{item.createdby}</td>
                                        <td className="px-3 py-1 border">{item.outtag}</td>
                                        <td className="px-3 py-1 border">
                                            <button
                                                onClick={() => handleitemdelete(item._id)}
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

                {/* Item Details */}
            </div>
        </div>
    )
}