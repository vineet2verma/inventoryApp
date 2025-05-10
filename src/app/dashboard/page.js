"use client";
import { React, useContext, useEffect, useState } from "react";
import SideMenu from "../components/sidebar";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [mastdata, setmastdate] = useState([])
  const [typelen, settypelen] = useState([])

  const router = useRouter();

  const invdemodata = [
    { name: "Running", value: 10 },
    { name: "Item Out", value: 20 },
    { name: "Item Hold", value: 10 },
  ];

  // fetching inv mast
  const fetchMastData = async () => {
    try {
      const res = await fetch("/api/createinvmast");
      const data = await res.json();
      setmastdate(data)
      const lengthtype = [
        { name: "Regular", length: data.filter((item) => item.type == "Regular").length },
        { name: "Discontinue", length: data.filter((item) => item.type == "Discontinue").length },
        { name: "On Order", length: data.filter((item) => item.type == "On Order").length },
      ]
      settypelen(lengthtype)
      console.log(typelen)

    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  }

  useEffect(() => {
    fetchMastData()
  }, [])

  return (
    <>
      {/* <SideMenu /> */}

      <div className="min-h-screen bg-gray-100 px-5 pt-4 ">
        {/* Header */}
        <header className="bg-white shadow p-4 mb-6 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className=" bg-white p-4 rounded-xl shadow">
            <h6 className="text-xl font-semibold mb-2">Overview</h6>
            <div className="flex justify-between ">
              <table className=" rounded min-w-35 text-sm text-left">
                <tbody>
                  {invdemodata.map((item, i) =>
                    <tr key={i} className="py-1">
                      <td className="px-1.5 ">{item.name}</td>
                      <td className="px-1.5 ">{item.value}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <table className="rounded min-w-35 text-sm text-left">
                <tbody>
                  {
                    typelen.map((item, i) => (
                      <tr key={i} className="py-1">
                        <td className="px-1.5 ">{item.name}</td>
                        <td className="px-1.5 ">{item.length}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Statistics</h2>
            <p className="text-gray-600">Chart or stats placeholder.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <p className="text-gray-600">You have 3 new messages.</p>
          </div>
        </main>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 pt-4">
          <button
            onClick={() => router.push("/locationmast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Location Mast
          </button>
          <button
            onClick={() => router.push("/typemast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Type Mast
          </button>
          {/* <button
            onClick={() => router.push("/tilemast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Tile Mast
          </button> */}
          <button
            onClick={() => router.push("/paymentmast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Payment Mast
          </button>
          <button
            onClick={() => router.push("/pricelist")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Price List
          </button>

          <button
            onClick={() => router.push("/createinvmast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Inventory Mast
          </button>
          <button
            onClick={() => router.push("/stockin")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Stock In
          </button>

          {/* <button
            onClick={() => { alert("Working on it") }}
            // onClick={() => router.push("/dealermast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Dealer Disc
          </button> */}

          <button
            onClick={() => router.push("/dealermast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Customers
          </button>

          {/* <button
            onClick={() => router.push("/dealerstock")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Dealer Stock
          </button> */}

          {/* <button
            onClick={() => router.push("/stockout")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Stock Out
          </button> */}

          {/* <button
            onClick={() => router.push("/clientmast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Clients
          </button> */}
          <button
            onClick={() => router.push("/breakage")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Breakage
          </button>
          <button
            onClick={() => router.push("/stockout")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Item Status
          </button>
       
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-gray-500">
          &copy; Antica Ceramica. All rights reserved.
        </footer>
      </div>
    </>
  );
}
