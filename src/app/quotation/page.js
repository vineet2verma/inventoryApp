// Editable Quotation Page Matching PDF Design
"use client";
import { useState } from "react";

export default function QuotationPage() {
    const [quotation, setQuotation] = useState({
        orderId: "Q-20250515",
        date: "2025-05-15",
        clientName: "John Doe",
        companyName: "Doe Industries",
        billingAddress: "123 Billing Address, City",
        shippingAddress: "456 Shipping Address, City",
        gst: "29ABCDE1234F2Z5",
        items: [
            { description: "Tile A", size: "2x2", quantity: 10, rate: 20 },
        ],
        discount: 0,
        gstRate: 18,
        cuttingCharges: 0,
        packingCharges: 0,
    });

    const [showCharges, setShowCharges] = useState(false);

    const handleItemChange = (index, field, value) => {
        const newItems = [...quotation.items];
        newItems[index][field] = field === "quantity" || field === "rate" ? Number(value) : value;
        setQuotation({ ...quotation, items: newItems });
    };

    const addItem = () => {
        setQuotation({
            ...quotation,
            items: [...quotation.items, { description: "", size: "", quantity: 0, rate: 0 }],
        });
    };

    const deleteItem = (index) => {
        const items = quotation.items.filter((_, i) => i !== index);
        setQuotation({ ...quotation, items });
    };

    const printPage = () => {
        window.print();
    };

    const subtotal = quotation.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const discountAmt = (subtotal * quotation.discount) / 100;
    const afterDiscount = subtotal - discountAmt;
    const gstAmt = (afterDiscount * quotation.gstRate) / 100;
    const grandTotal = afterDiscount + gstAmt + Number(quotation.cuttingCharges || 0) + Number(quotation.packingCharges || 0);

    return (
        <div className="p-2 max-w-5xl mx-auto bg-white shadow-xl rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="text-center w-full">
                    <h1 className="text-3xl font-bold">Antica Ceramica</h1>
                    <p>Contact: 9999999999 | GSTIN: 09AAECA1234K1Z2</p>
                    <h2 className="mt-4 text-xl font-semibold underline">Quotation</h2>
                </div>
                <div className="flex space-x-2 print:hidden">
                    <button onClick={printPage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Download</button>
                    <button onClick={() => setShowCharges(true)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Charges</button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                <div>
                    <label>Client Name</label>
                    <input type="text" className="border w-full px-2 py-1" value={quotation.clientName} onChange={e => setQuotation({ ...quotation, clientName: e.target.value })} />
                    <label>Company Name</label>
                    <input type="text" className="border w-full px-2 py-1" value={quotation.companyName} onChange={e => setQuotation({ ...quotation, companyName: e.target.value })} />

                    <label>GSTIN</label>
                    <input type="text" className="border w-full px-2 py-1" value={quotation.gst} onChange={e => setQuotation({ ...quotation, gst: e.target.value })} />
                </div>
                <div>
                    <label>Order ID</label>
                    <input type="text" className="border w-full px-2 py-1" value={quotation.orderId} onChange={e => setQuotation({ ...quotation, orderId: e.target.value })} />
                    <label>Date</label>
                    <input type="date" className="border w-full px-2 py-1" value={quotation.date} onChange={e => setQuotation({ ...quotation, date: e.target.value })} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm ">
                <div>
                    <label>Billing Address</label>
                    <textarea className="border w-full px-2 py-1" value={quotation.billingAddress} onChange={e => setQuotation({ ...quotation, billingAddress: e.target.value })} />
                </div>
                <div>
                    <label>Shipping Address</label>
                    <textarea className="border w-full px-2 py-1" value={quotation.shippingAddress} onChange={e => setQuotation({ ...quotation, shippingAddress: e.target.value })} />
                </div>
            </div>




            <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1">S.No</th>
                        <th className="border px-2 py-1">Description</th>
                        <th className="border px-2 py-1">Size</th>
                        <th className="border px-2 py-1">Qty</th>
                        <th className="border px-2 py-1">Rate</th>
                        <th className="border px-2 py-1">Amount</th>
                        <th className="border px-2 py-1 print:hidden">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {quotation.items.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-2 py-1 text-center">{index + 1}</td>
                            <td className="border px-2 py-1">
                                <input className="w-full border px-1" value={item.description} onChange={e => handleItemChange(index, "description", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input className="w-full border px-1" value={item.size} onChange={e => handleItemChange(index, "size", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input type="number" className="w-full border px-1" value={item.quantity} onChange={e => handleItemChange(index, "quantity", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input type="number" className="w-full border px-1" value={item.rate} onChange={e => handleItemChange(index, "rate", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1 text-right">₹{(item.quantity * item.rate).toFixed(2)}</td>
                            <td className="border px-2 py-1 text-center print:hidden ">
                                <button className="text-red-500" onClick={() => deleteItem(index)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addItem} className="mt-2 px-4 py-1 border rounded hover:bg-gray-100">+ Add Item</button>

            <div className="mt-6 space-y-2 text-sm text-right">
                <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
                {quotation.discount > 0 && <div>Discount ({quotation.discount}%): -₹{discountAmt.toFixed(2)}</div>}
                {quotation.gstRate > 0 && <div>GST ({quotation.gstRate}%): ₹{gstAmt.toFixed(2)}</div>}
                {quotation.cuttingCharges > 0 && <div>Cutting Charges: ₹{quotation.cuttingCharges}</div>}
                {quotation.packingCharges > 0 && <div>Packing Charges: ₹{quotation.packingCharges}</div>}
                <div className="text-lg font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</div>
            </div>

            <div className="mt-10 text-sm text-gray-600">
                <p>Thank you for your business!</p>
                <p className="mt-4">Authorized Signatory</p>
            </div>

            {showCharges && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h3 className="text-lg font-semibold mb-4">Enter Charges</h3>
                        <div className="space-y-3">
                            <div>
                                <label>Discount (%)</label>
                                <input type="number" className="border w-full px-2 py-1" value={quotation.discount} onChange={e => setQuotation({ ...quotation, discount: e.target.value })} />
                            </div>
                            <div>
                                <label>GST Rate (%)</label>
                                <input type="number" className="border w-full px-2 py-1" value={quotation.gstRate} onChange={e => setQuotation({ ...quotation, gstRate: e.target.value })} />
                            </div>
                            <div>
                                <label>Cutting Charges</label>
                                <input type="number" className="border w-full px-2 py-1" value={quotation.cuttingCharges} onChange={e => setQuotation({ ...quotation, cuttingCharges: e.target.value })} />
                            </div>
                            <div>
                                <label>Packing Charges</label>
                                <input type="number" className="border w-full px-2 py-1" value={quotation.packingCharges} onChange={e => setQuotation({ ...quotation, packingCharges: e.target.value })} />
                            </div>
                        </div>
                        <div className="text-right mt-4">
                            <button onClick={() => setShowCharges(false)} className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
