"use client";
import React, { useEffect, useState } from "react";
import { LoginUserFunc } from "../context/loginuser";
import { useRouter } from "next/navigation";
import { House, ArrowBigLeft } from "lucide-react";

export default function FollowUpDashboard() {
  const { user } = LoginUserFunc();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedSalesperson, setSelectedSalesperson] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [currentuser, setcurrentuser] = useState("");

  useEffect(() => {
    const currentUser =
      user.user?.role == "admin" || user.user?.role == "crm" || user.user?.role == "super admin"
        ? "admin"
        : user.user?.name;

    fetch(`api/crmreportingcount?user=${currentUser}`) // Adjust if needed


    .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setFiltered(res.data);

          const uniqueSalespeople = [
            ...new Set(res.data.map((d) => d.SalesPerson)),
          ];
          setSalespeople(uniqueSalespeople);

          const uniqueDates = [...new Set(res.data.map((d) => d.Date))];
          setDates(uniqueDates);
        }
      });
  }, [user]);

  const handleFilter = (salespersonValue, dateValue) => {
    let filteredData = [...data];

    if (salespersonValue !== "all") {
      filteredData = filteredData.filter(
        (d) => d.SalesPerson === salespersonValue
      );
    }

    if (dateValue !== "all") {
      filteredData = filteredData.filter((d) => d.Date === dateValue);
    }

    setFiltered(filteredData);
  };

  const handleSalespersonChange = (e) => {
    const value = e.target.value;
    setSelectedSalesperson(value);
    handleFilter(value, selectedDate);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    handleFilter(selectedSalesperson, value);
  };

  return (
    <>
      <div className="mx-4 my-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Left Side: Home button + Title */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 ml-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-xs px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-fit"
          >
            <House className="w-5 h-5" />
            Home
          </button>
          <h1 className="text-xl md:text-2xl font-bold">Daily CRM Summary</h1>
        </div>

        {/* Right Side: Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label className="font-medium w-28">Salesperson:</label>
            <select
              onChange={handleSalespersonChange}
              value={selectedSalesperson}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="all">All</option>
              {salespeople.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium w-28">Date:</label>
            <select
              onChange={handleDateChange}
              value={selectedDate}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="all">All</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 max-w-full mx-auto">
        <div className="w-full overflow-x-auto rounded-lg border-1 shadow">
          <div className="min-w-[800px]">
            <table className="w-full table-auto border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100 font-semibold">
                <tr>
                  <th className="px-4 py-2 border text-left ">Date</th>
                  <th className="px-4 py-2 border text-left ">Salesperson</th>
                  <th className="px-4 py-2 border text-center ">New Client</th>
                  <th className="px-4 py-2 border text-center ">
                    Updated Client
                  </th>
                  <th className="px-4 py-2 border text-center ">Follow Up</th>
                  <th className="px-4 py-2 border text-center ">Closed Won</th>
                  <th className="px-4 py-2 border text-center ">Closed Lost</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-left">
                        {item.Date}
                      </td>
                      <td className="px-4 py-2 border text-left">
                        {item.SalesPerson}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.NewClient}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.UpdatedClient}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.FollowUp}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.ClosedWon}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.ClosedLost}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
