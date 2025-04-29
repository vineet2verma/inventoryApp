"use client";
import React from "react";
import SideMenu from "../components/sidebar";

export default function Dashboard() {
  return (
    <>
      <SideMenu />

      <div className="min-h-screen bg-gray-100 p-4">
        {/* Header */}
        <header className="bg-white shadow p-4 mb-6 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-600">This is a summary of recent activity.</p>
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

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-gray-500">
          &copy; 2025 Your Company. All rights reserved.
        </footer>
      </div>

    </>


  );
}
