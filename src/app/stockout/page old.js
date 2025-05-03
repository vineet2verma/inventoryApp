// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function StockOutPage() {
//   const [records, setRecords] = useState([]);
//   const [form, setForm] = useState({});
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const fetchRecords = async () => {
//     const res = await fetch("/api/stockout");
//     const data = await res.json();
//     setRecords(data);
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     const method = editingId ? "PUT" : "POST";
//     const body = editingId ? JSON.stringify({ id: editingId, ...form }) : JSON.stringify(form);

//     await fetch("/api/stockout", {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body,
//     });
//     setShowForm(false);
//     setForm({});
//     setEditingId(null);
//     fetchRecords();
//   };

//   const handleEdit = (record) => {
//     setForm(record);
//     setEditingId(record._id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     await fetch("/api/stockout", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     fetchRecords();
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Stock Out</h1>
//         <div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
//           >
//             Add
//           </button>
//           <button
//             onClick={() => router.push("/dashboard")}
//             className="bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Back
//           </button>
//         </div>
//       </div>

//       {showForm && (
//         <div className="bg-white border p-4 rounded shadow mb-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input name="date" value={form.date || ""} onChange={handleChange} placeholder="Date" className="border p-2 rounded" />
//             <input name="designName" value={form.designName || ""} onChange={handleChange} placeholder="Design Name" className="border p-2 rounded" />
//             <input name="coName" value={form.coName || ""} onChange={handleChange} placeholder="Company Name" className="border p-2 rounded" />
//             <input name="batchNo" value={form.batchNo || ""} onChange={handleChange} placeholder="Batch No" className="border p-2 rounded" />
//             <input name="type" value={form.type || ""} onChange={handleChange} placeholder="Type" className="border p-2 rounded" />
//             <input name="size" value={form.size || ""} onChange={handleChange} placeholder="Size" className="border p-2 rounded" />
//             <input name="weight" value={form.weight || ""} onChange={handleChange} placeholder="Weight" className="border p-2 rounded" />
//             <input name="pcPerBox" value={form.pcPerBox || ""} onChange={handleChange} placeholder="PC/Box" className="border p-2 rounded" />
//             <input name="location" value={form.location || ""} onChange={handleChange} placeholder="Location" className="border p-2 rounded" />
//             <input name="purPrice" value={form.purPrice || ""} onChange={handleChange} placeholder="Purchase Price" className="border p-2 rounded" />
//             <input name="currStock" value={form.currStock || ""} onChange={handleChange} placeholder="Current Stock" className="border p-2 rounded" />
//             <input name="createdBy" value={form.createdBy || ""} onChange={handleChange} placeholder="Created By" className="border p-2 rounded" />
//           </div>
//           <div className="mt-4">
//             <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded mr-2">
//               {editingId ? "Update" : "Add"}
//             </button>
//             <button onClick={() => { setShowForm(false); setForm({}); setEditingId(null); }} className="bg-gray-400 text-white px-4 py-2 rounded">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-4 py-2">Date</th>
//               <th className="border px-4 py-2">Design Name</th>
//               <th className="border px-4 py-2">Company</th>
//               <th className="border px-4 py-2">Batch</th>
//               <th className="border px-4 py-2">Type</th>
//               <th className="border px-4 py-2">Size</th>
//               <th className="border px-4 py-2">Weight</th>
//               <th className="border px-4 py-2">PC/Box</th>
//               <th className="border px-4 py-2">Location</th>
//               <th className="border px-4 py-2">Price</th>
//               <th className="border px-4 py-2">Stock</th>
//               <th className="border px-4 py-2">Created By</th>
//               <th className="border px-4 py-2">Timestamp</th>
//               <th className="border px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((record) => (
//               <tr key={record._id} className="hover:bg-gray-50">
//                 <td className="border px-4 py-2">{record.date}</td>
//                 <td className="border px-4 py-2">{record.designName}</td>
//                 <td className="border px-4 py-2">{record.coName}</td>
//                 <td className="border px-4 py-2">{record.batchNo}</td>
//                 <td className="border px-4 py-2">{record.type}</td>
//                 <td className="border px-4 py-2">{record.size}</td>
//                 <td className="border px-4 py-2">{record.weight}</td>
//                 <td className="border px-4 py-2">{record.pcPerBox}</td>
//                 <td className="border px-4 py-2">{record.location}</td>
//                 <td className="border px-4 py-2">{record.purPrice}</td>
//                 <td className="border px-4 py-2">{record.currStock}</td>
//                 <td className="border px-4 py-2">{record.createdBy}</td>
//                 <td className="border px-4 py-2">{new Date(record.createdAt).toLocaleString()}</td>
//                 <td className="border px-4 py-2 space-x-2">
//                   <button onClick={() => handleEdit(record)} className="text-blue-600">Edit</button>
//                   <button onClick={() => handleDelete(record._id)} className="text-red-600">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

