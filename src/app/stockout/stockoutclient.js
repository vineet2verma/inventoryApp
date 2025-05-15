// "use client";
// import { useState } from "react";

// export default function StockOutClientOrderForm() {
//     const [formData, setFormData] = useState({
//         date: "",
//         orderId: "",
//         ordDate: "",
//         name: "",
//         mobile: "",
//         gstNo: "",
//         paymentMode: "",
//         billAddress: "",
//         delAddress: "",
//         refBy: "",
//         delDate: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Submitted:", formData);
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="max-w-4xl mx-auto bg-white shadow rounded-xl p-4 space-y-4 text-sm"
//         >
//             <h2 className="text-lg font-semibold mb-2 text-gray-700">Client Order Form</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block mb-1 text-gray-600">Date</label>
//                     <input
//                         type="date"
//                         name="date"
//                         value={formData.date}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">Order ID</label>
//                     <input
//                         type="text"
//                         name="orderId"
//                         value={formData.orderId}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">Order Date</label>
//                     <input
//                         type="date"
//                         name="ordDate"
//                         value={formData.ordDate}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">Mobile</label>
//                     <input
//                         type="text"
//                         name="mobile"
//                         value={formData.mobile}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">GST No</label>
//                     <input
//                         type="text"
//                         name="gstNo"
//                         value={formData.gstNo}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">Payment Mode</label>
//                     <input
//                         type="text"
//                         name="paymentMode"
//                         value={formData.paymentMode}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">Referred By</label>
//                     <input
//                         type="text"
//                         name="refBy"
//                         value={formData.refBy}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>

//                 <div>
//                     <label className="block mb-1 text-gray-600">Delivery Date</label>
//                     <input
//                         type="date"
//                         name="delDate"
//                         value={formData.delDate}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded text-sm"
//                     />
//                 </div>
//             </div>

//             <div>
//                 <label className="block mb-1 text-gray-600">Billing Address</label>
//                 <textarea
//                     name="billAddress"
//                     value={formData.billAddress}
//                     onChange={handleChange}
//                     rows={2}
//                     className="w-full p-2 border rounded text-sm"
//                 />
//             </div>

//             <div>
//                 <label className="block mb-1 text-gray-600">Delivery Address</label>
//                 <textarea
//                     name="delAddress"
//                     value={formData.delAddress}
//                     onChange={handleChange}
//                     rows={2}
//                     className="w-full p-2 border rounded text-sm"
//                 />
//             </div>

//             <div className="text-right">
//                 <button
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm"
//                 >
//                     Submit
//                 </button>
//             </div>
//         </form>
//     );
// }
