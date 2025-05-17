"use client";
import { React, useContext, useEffect, useState } from "react";
import SideMenu from "../components/sidebar";
import { useRouter } from "next/navigation";
import { LoginUserFunc } from "@/app/context/loginuser";
import moment from "moment";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [mastdata, setmastdate] = useState([]);
  const [typelen, settypelen] = useState([]);
  const [permissionloc, setpermissionloc] = useState(false);
  const [permissiontype, setpermissiontype] = useState(false);
  const [permissionpayment, setpermissionpayment] = useState(false);
  const [permissionprice, setpermissionprice] = useState(false);
  const [permissioninvmast, setpermissioninvmast] = useState(false);
  const [permissionstockkin, setpermissionstockin] = useState(false);
  const [permissioncust, setpermissioncust] = useState(false);
  const [permissionbreakage, setpermissionbreakage] = useState(false);
  const [permissionitemstatus, setpermissionitemstatus] = useState(false);
  const [permissionquotation, setpermissionquotation] = useState(false);

  const tdate = new Date();
  const today = moment(tdate).format("DD / MMM / yyyy");

  const { user } = LoginUserFunc();
  const router = useRouter();
  const invdemodata = [
    { name: "Total Hold", value: 10 },
    { name: "Today Hold", value: 20 },
    { name: "Today Out", value: 10 },
  ];

  // fetching inv mast
  const fetchMastData = async () => {
    try {
      const res = await fetch("api/typecount");
      const data = await res.json();
      setmastdate(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  useEffect(() => {
    fetchMastData();
  }, []);

  useEffect(() => {
    setpermissionloc(user.user?.plocation.includes("read"));
    setpermissiontype(user.user?.ptype.includes("read"));
    setpermissionpayment(user.user?.ppaymenttype.includes("read"));
    setpermissionprice(user.user?.pprice.includes("read"));
    setpermissioninvmast(user.user?.pinventory.includes("read"));
    setpermissionstockin(user.user?.pstockin.includes("read"));
    setpermissioncust(user.user?.pcustomer.includes("read"));
    setpermissionbreakage(user.user?.pbreakage.includes("read"));
    setpermissionitemstatus(user.user?.pitemstatus.includes("read"));
    setpermissionquotation(user.user?.pquotation.includes("read"));
  }, [user]);

  return (
    <>
      {/* <SideMenu /> */}

      <div className="min-h-screen bg-gray-100 px-5 pt-4 ">
        {/* Header */}
        <header className="flex justify-between bg-white shadow p-4 mb-6 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <h1 className="text-2xl font-bold text-gray-800">
            {user.user?.name}
          </h1>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className=" bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between">
              <h6 className="text-xl font-semibold mb-2">Status :</h6>
              <h6 className="text-xl font-semibold mb-2">{today}</h6>
            </div>
            <div className="flex justify-between ">
              <table className=" rounded min-w-115 text-sm text-left">
                <tbody>
                  {invdemodata.map((item, i) => (
                    <tr key={i} className="py-1 font-bold">
                      <td className="px-1.5 ">{item.name}</td>
                      <td className="px-1.5 ">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <div className="flex justify-between mb-2">
              <h2 className="text-xl font-semibold ">Status :</h2>
              <h2 className="text-xl font-semibold ">Type</h2>
            </div>
            <table className="rounded min-w-118 text-sm text-left font-bold">
              <tbody>
                <tr className="py-1">
                  <td className="px-1.5 ">Regular</td>
                  <td className="px-1.5">{mastdata.regularcount}</td>
                </tr>
                <tr className="py-1">
                  <td className="px-1.5 ">Discontinue</td>
                  <td className="px-1.5 ">{mastdata.discontinuecount}</td>
                </tr>
                <tr className="py-1">
                  <td className="px-1.5 ">On Order</td>
                  <td className="px-1.5 ">{mastdata.onordercount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <p className="text-gray-600">You have 3 new messages.</p>
          </div>
        </main>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 pt-4">
          {permissionloc && (
            <button
              onClick={() => router.push("/locationmast")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Location Mast
            </button>
          )}

          {permissiontype && (
            <button
              onClick={() => router.push("/typemast")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Type Mast
            </button>
          )}
          {/* <button
            onClick={() => router.push("/tilemast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Tile Mast
          </button> */}
          {permissionpayment && (
            <button
              onClick={() => router.push("/paymentmast")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Payment Mast
            </button>
          )}
          {permissionprice && (
            <button
              onClick={() => router.push("/pricelist")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Price List
            </button>
          )}

          {permissioninvmast && (
            <button
              onClick={() => router.push("/createinvmast")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Inventory Mast
            </button>
          )}

          {permissionstockkin && (
            <button
              onClick={() => router.push("/stockin")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Stock In
            </button>
          )}

          {permissioncust && (
            <button
              onClick={() => router.push("/dealermast")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Customers
            </button>
          )}

          {/* <button
            onClick={() => router.push("/clientmast")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Clients
          </button> */}
          {permissionbreakage && (
            <button
              onClick={() => router.push("/breakage")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Breakage
            </button>
          )}

          {permissionitemstatus && (
            <button
              onClick={() => router.push("/stockout")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Item Status
            </button>
          )}

          {permissionquotation && (
            <button
              onClick={() => router.push("/quotation")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Quotation
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-gray-500">
          &copy; Antica Ceramica. All rights reserved.
        </footer>
      </div>
    </>
  );
}
