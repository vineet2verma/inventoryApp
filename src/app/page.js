"use client"
import Image from "next/image";
import Dashboard from "./dashboard/page";
import { useContext, useState } from "react";
import { DealerProvider } from "./context";

export default function Home() {
  const [dealerstate, setDealerState] = useState({
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
  })

  return (
    <dealerContext.Provider value={{ dealerstate, setDealerState }}>
      <Dashboard />
    </dealerContext.Provider>
  );
}
