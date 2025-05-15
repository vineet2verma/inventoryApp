"use client";
import { useState } from "react";

// import StockOutClientOrderForm from "./stockoutclient";
// import StockOutDealerOrderForm from "./stockoutdealer";
// import StockOutBreakageOrderForm from "./stockoutitem";
import StockTableItemDetailPage from "./itemdetail";

export default function StockOutPage() {
    const [activeForm, setActiveForm] = useState("table");
    //  return <StockTableItemDetailPage />;

    const renderForm = () => {
        switch (activeForm) {
            case "client":
                return <StockOutClientOrderForm />;
            case "dealers":
                return <StockOutDealerOrderForm />;
            case "breakages":
                return <StockOutBreakageOrderForm />;
            default:
                return <StockTableItemDetailPage />;
        }
    };

    return (
        <div>
            {/* Buttons always visible */}
            {/* <div className="flex m-4 flex-wrap gap-2">
                <button onClick={() => setActiveForm("client")} className="bg-blue-500 text-white p-2 rounded">
                    Client
                </button>
                <button onClick={() => setActiveForm("dealers")} className="bg-green-500 text-white p-2 rounded">
                    Dealers
                </button>
                <button onClick={() => setActiveForm("breakages")} className="bg-red-500 text-white p-2 rounded">
                    Breakages
                </button>
                <button onClick={() => setActiveForm("table")} className="bg-gray-500 text-white p-2 rounded">
                    Back to Table
                </button>
            </div> */}

            {/* Dynamic content */}
            <div className="mt-4 px-2">
                {renderForm()}
            </div>
        </div>
    );
}
