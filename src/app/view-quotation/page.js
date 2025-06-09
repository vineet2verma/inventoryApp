"use client";
import moment from "moment";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { House, FileText, Trash2 } from "lucide-react";
import { LoginUserFunc } from "../context/loginuser";
import LoadingSpinner from "../components/waiting";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable"; // <== important!

export default function ViewQuotation() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSalesperson, setFilterSalesperson] = useState("");
  const [filterClientName, setFilterClientName] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [showfilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const { user } = LoginUserFunc();

  const handleprev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchQuotation(newPage);
    }
  };

  const handlenext = () => {
    if (totalPages > currentPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchQuotation(newPage);
    }
  };

  async function fetchQuotation(currentPage) {
    try {
      const res = await fetch(
        `/api/quotation/view?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await res.json();
      setQuotations(data.records);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    fetchQuotation(currentPage);
  }, [currentPage]);

  const filteredQuotations = quotations.filter((q) => {
    return (
      q.saleperson?.toLowerCase().includes(filterSalesperson.toLowerCase()) &&
      q.clientName?.toLowerCase().includes(filterClientName.toLowerCase()) &&
      q.companyName?.toLowerCase().includes(filterCompany.toLowerCase()) &&
      JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  async function handledelete(id) {
    if (confirm("Are you sure you want to delete this quotation?")) {
      try {
        const req = await fetch(`/api/quotation`, {
          method: "DELETE",
          body: JSON.stringify({ _id: id }),
        });
        const res = await req.json();

        if (res.success) {
          alert("Quotation deleted successfully");
          fetchQuotation(currentPage);
        } else {
          alert("Failed to delete quotation");
        }
      } catch (err) {
        alert(err.message);
      }
    }
  }

  const handleExcelExport = () => {
    const exportData = filteredQuotations.map((item) => ({
      Date: moment(item.date).format("DD/MM/YYYY"),
      OrderID: item.orderId,
      Client: item.clientName,
      Company: item.companyName,
      Salesperson: item.saleperson,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Quotations.xlsx");
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    const tableData = filteredQuotations.map((item) => [
      moment(item.date).format("DD/MM/YYYY"),
      item.orderId,
      item.clientName,
      item.companyName,
      item.saleperson,
    ]);

    autoTable(doc, {
      head: [["Date", "Order ID", "Client", "Company", "Salesperson"]],
      body: tableData,
    });
    doc.save("Quotations.pdf");
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="px-4 py-2 bg-gray-100">
          <div className="flex flex-wrap justify-between gap-2 mb-4">
            <div className="flex items-center gap-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <House className="w-5 h-5" />
                Home
              </button>
              <h1 className="text-2xl font-bold">Quotation List</h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(user.user?.role === "admin" ||
                user.user?.role === "super admin") && (
                <button
                  onClick={handleExcelExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Export Excel
                </button>
              )}
              {(user.user?.role === "admin" ||
                user.user?.role === "super admin") && (
                <button
                  onClick={handlePDFExport}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Export PDF
                </button>
              )}
              <button
                onClick={() => setShowFilter(!showfilter)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
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

          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead className="sticky top-0 bg-blue-600 text-white">
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
                {filteredQuotations.length > 0 ? (
                  (user.user?.role === "admin" ||
                  user.user?.role === "super admin"
                    ? filteredQuotations
                    : filteredQuotations.filter(
                        (item) => item.saleperson === user.user?.name
                      )
                  ).map((q, index) => (
                    <tr key={index} className="odd:bg-gray-200 even:bg-white">
                      <td className="px-2 text-center py-1 text-xs">
                        {moment(q.date).format("MM/DD/YYYY")}
                      </td>
                      <td className="px-2 text-center py-1 text-xs">
                        {q.orderId}
                      </td>
                      <td className="px-2 text-center py-1 text-xs">
                        {q.clientName}
                      </td>
                      <td className="px-2 text-center py-1 text-xs">
                        {q.companyName}
                      </td>
                      <td className="px-2 text-center py-1 text-xs">
                        {q.saleperson}
                      </td>

                      <td className="flex justify-center gap-2 py-1">
                        <Link
                          href={`/quotation/${q._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-sm"
                        >
                          <FileText />
                        </Link>
                        {user.user?.role === "admin" && (
                          <button
                            onClick={() => handledelete(q._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-sm"
                          >
                            <Trash2 className="w-4 h-4 inline-block" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No quotations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Page Number Buttons */}
          <div className="flex justify-between px-5 items-center max-w-100 m-auto mt-5">
            <button
              className="bg-yellow-500 px-5 py-2 rounded-2xl border-1"
              onClick={() => {
                handleprev();
              }}
            >
              Prev
            </button>
            <p>
              <strong>{currentPage}</strong>
            </p>
            <button
              className="bg-green-500 px-5 py-2 rounded-2xl border-1"
              onClick={() => {
                handlenext();
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
