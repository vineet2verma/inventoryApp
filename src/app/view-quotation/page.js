"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { House } from "lucide-react";
import { LoginUserFunc } from "../context/loginuser";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function ViewQuotation() {
  const router = useRouter();
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSalesperson, setFilterSalesperson] = useState("");
  const [filterClientName, setFilterClientName] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [showfilter, setShowFilter] = useState(false);

  async function fetchQuotation() {
    try {
      const req = await fetch("/api/quotation");
      const res = await req.json();
      setQuotations(res.data);
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    fetchQuotation();
  }, []);

  const filteredQuotations = quotations.filter((q) => {
    return (
      q.saleperson?.toLowerCase().includes(filterSalesperson.toLowerCase()) &&
      q.clientName?.toLowerCase().includes(filterClientName.toLowerCase()) &&
      q.companyName?.toLowerCase().includes(filterCompany.toLowerCase()) &&
      JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="px-4 py-2 bg-gray-100 ">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <House className="w-5 h-5" />
            Home
          </button>

          <h1 className="sm:text-center md:text-left text-2xl font-bold">
            Quotation List
          </h1>
        </div>
        <div className="flex md:justify-end">
          <button
            onClick={() => setShowFilter(!showfilter)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md w-full md:w-auto"
          >
            {showfilter ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {showfilter && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Salesperson"
            className="p-2 border rounded"
            value={filterSalesperson}
            onChange={(e) => setFilterSalesperson(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Client Name"
            className="p-2 border rounded"
            value={filterClientName}
            onChange={(e) => setFilterClientName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Company"
            className="p-2 border rounded"
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
          />
        </div>
      )}

      <div className="overflow-x-auto overflow-y-auto sticky top-0 shadow-md rounded-lg max-h-110">
        <table className="min-w-full table-auto border-collapse">
          <thead className="sticky top-0  bg-blue-600 text-white ">
            <tr>
              <th className="px-2 py-1 text-center">Date</th>
              <th className="px-2 py-1 text-center">Order ID</th>
              <th className="px-2 py-1 text-center">Client Name</th>
              <th className="px-2 py-1 text-center">Company Name</th>
              <th className="px-2 py-1 text-center">Salesperson</th>
              <th className="px-2 py-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuotations.map((q, index) => (
              <tr key={index} className=" odd:bg-gray-200 even:bg-white ">
                <td className="px-2 text-center py-1 text-xs">
                  {moment(new Date(q.date)).format("MM/DD/YYYY")}
                  {/* {new Date(q.date).toLocaleDateString()} */}
                </td>
                <td className="px-2 text-center py-1 text-xs">{q.orderId}</td>
                <td className="px-2 text-center py-1 text-xs">
                  {q.clientName}
                </td>
                <td className="px-2 text-center py-1 text-xs">
                  {q.companyName}
                </td>
                <td className="px-2 text-center py-1 text-xs">
                  {q.saleperson}
                </td>
                <td className="px-2 text-center py-2 text-xs">
                  <Link
                    href={`/quotation/${q.orderId}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {filteredQuotations.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 flex gap-4">
        {/* <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> */}
        <p className="text-sm  text-gray-500 mt-4">
          Total Quotations: {filteredQuotations.length}
        </p>
        <p className="text-sm  text-gray-500 mt-4">
          Today Quotations:{" "}
          {
            filteredQuotations.filter(
              (item) =>
                moment(item.date).format("MM/DD/YYYY") ==
                moment(new Date()).format("MM/DD/YYYY")
            ).length
          }
        </p>
      </div>
    </div>
  );
}
