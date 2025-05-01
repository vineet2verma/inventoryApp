"use client";
import React from "react";
import SideMenu from "../components/sidebar";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <>
      <SideMenu />

      <div className="min-h-screen bg-gray-100 pl-25 pr-4 ">
        {/* Header */}
        <header className="bg-white shadow p-4 mb-6 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-600">
              This is a summary of recent activity.
            </p>
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
          <button
            onClick={() => router.push("/tilemast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Tile Mast
          </button>
          <button
            onClick={() => router.push("/createinvmast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Inventory Mast
          </button>
          <button
            onClick={() => router.push("/dealermast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Dealer Mast
          </button>

          <button
            onClick={() => router.push("/dealerstock")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Dealer Stock
          </button>

          <button
            onClick={() => router.push("/stockin")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Stock In
          </button>
          <button
            onClick={() => router.push("/stockout")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Stock Out
          </button>

          <button
            onClick={() => router.push("/pricelist")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Price List
          </button>

          <button
            onClick={() => router.push("/clients")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Clients Info
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
