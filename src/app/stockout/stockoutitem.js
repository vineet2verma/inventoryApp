// "use client"
// import React, { useState } from 'react';

// export default function StockOutBreakageOrderForm() {
//     const [showOrderModal, setShowOrderModal] = useState(false);
//     const [showItemModal, setShowItemModal] = useState(false);

//     return (
//         <div className="w-full">
//             {/* Sticky Header */}
//             <div className="fixed top-0 w-full bg-white p-2 z-10 shadow-md flex justify-between items-center">
//                 <div className="space-x-2">
//                     <button
//                         className="btn btn-success bg-green-500 text-white px-4 py-2 rounded"
//                         onClick={() => setShowOrderModal(true)}
//                     >
//                         Breakages Form
//                     </button>
//                     <button className="btn btn-success d-none hidden">Save</button>
//                     <button className="btn btn-danger d-none hidden">Print</button>
//                 </div>
//                 <input
//                     className="form-control p-2 border rounded"
//                     placeholder="Type to search..."
//                 />
//             </div>

//             {/* Order Modal */}
//             {showOrderModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded shadow-lg w-full max-w-2xl p-4">
//                         <div className="flex justify-between items-center border-b pb-2">
//                             <h2 className="text-xl font-semibold">Customer Detail Form</h2>
//                             <button onClick={() => setShowOrderModal(false)} className="text-xl">&times;</button>
//                         </div>
//                         <form className="grid grid-cols-2 gap-4 mt-4">
//                             <div>
//                                 <label className="block">Customer Name</label>
//                                 <input type="text" className="w-full border p-2 rounded" required />
//                             </div>
//                             <div>
//                                 <label className="block">Customer Mobile</label>
//                                 <input type="tel" className="w-full border p-2 rounded" />
//                             </div>
//                             <div>
//                                 <label className="block">Customer Address</label>
//                                 <textarea className="w-full border p-2 rounded"></textarea>
//                             </div>
//                             <div>
//                                 <label className="block">Delivery Address</label>
//                                 <textarea className="w-full border p-2 rounded"></textarea>
//                             </div>
//                             <div>
//                                 <label className="block">Expected Delivery Date</label>
//                                 <input type="date" className="w-full border p-2 rounded" />
//                             </div>
//                             <div>
//                                 <label className="block">Sales Person</label>
//                                 <select className="w-full border p-2 rounded">
//                                     {/* salespersonlist */}
//                                 </select>
//                             </div>
//                             <div className="col-span-2">
//                                 <label className="block">Payment Status</label>
//                                 <select className="w-full border p-2 rounded">
//                                     <option value="Advance">Advance</option>
//                                     <option value="Approved Rahul Sir">Approved Rahul Sir</option>
//                                     <option value="Approved Ravi Sir">Approved Ravi Sir</option>
//                                     <option value="On Site">On Site</option>
//                                 </select>
//                             </div>
//                         </form>
//                         <div className="flex justify-end mt-4">
//                             <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setShowOrderModal(false)}>Close</button>
//                             <button className="bg-blue-600 text-white px-4 py-2 rounded">Save changes</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Order Display */}
//             <div className="mt-20 px-4">
//                 <div className="bg-primary text-center p-2 border border-black">
//                     <h3 className="text-black font-bold">Antica Ceramica</h3>
//                 </div>

//                 <div className="bg-yellow-300 text-center p-2 border border-black mt-2">
//                     <p className="font-bold">New Order Details</p>
//                 </div>

//                 {/* Address Section */}
//                 <div className="grid grid-cols-2 gap-4 mt-2 border border-black p-2">
//                     <div>
//                         <p>Client Address</p>
//                         <ul><li>XXXXXXXXXXXX</li></ul>
//                     </div>
//                     <div>
//                         <p>Delivery Address</p>
//                         <ul><li>XXXXXXXXXXXX</li></ul>
//                     </div>
//                 </div>

//                 {/* Client Details */}
//                 <div className="grid grid-cols-3 gap-4 mt-2 border border-black p-2">
//                     <table className="text-sm">
//                         <tbody>
//                             <tr><td>Client Name</td><td>John Doe</td></tr>
//                             <tr><td>Client Mob</td><td>9999999999</td></tr>
//                             <tr><td>Payment</td><td>Advance</td></tr>
//                         </tbody>
//                     </table>
//                     <table className="text-sm">
//                         <tbody>
//                             <tr><td>Order No</td><td>#ORD12345</td></tr>
//                             <tr><td>Order Date</td><td>2025-05-04</td></tr>
//                         </tbody>
//                     </table>
//                     <table className="text-sm">
//                         <tbody>
//                             <tr><td>Exp Del Date</td><td>2025-05-10</td></tr>
//                             <tr><td>Sales Person</td><td>Jane Smith</td></tr>
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Item Table */}
//                 <div className="overflow-x-auto mt-2">
//                     <table className="table-auto w-full text-center border border-black">
//                         <thead className="bg-gray-200">
//                             <tr>
//                                 <th>Product Name</th>
//                                 <th>Size</th>
//                                 <th>Batch No</th>
//                                 <th>Qty</th>
//                                 <th>Unit Type</th>
//                                 <th>
//                                     <button
//                                         className="bg-green-500 text-white px-2 py-1 rounded"
//                                         onClick={() => setShowItemModal(true)}
//                                     >+
//                                     </button>
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {/* Order items go here */}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Item Modal can be added similarly */}
//         </div>
//     );
// }
