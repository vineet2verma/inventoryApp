"use client";
import { React, useEffect, useState } from "react";
import SideMenu from "../components/sidebar";
import { LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
import { LoginUserFunc } from "@/app/context/loginuser";
import moment from "moment";
import LoadingSpinner from "../components/waiting";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [mastdata, setmastdate] = useState([]);
  const [itemdetailcount, setitemdetailcount] = useState([]);
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
  const [permissionmorbi, setpermissionmorbi] = useState(false);
  const [permisson, setpermisson] = useState([]);

  const tdate = new Date();
  const today = moment(tdate).format("DD / MMM / yyyy");

  const { user } = LoginUserFunc();
  const router = useRouter();

  const handleSignOut = async () => {
    let resp = await fetch("api/signout")
    if (resp.ok) {
      router.push("/signin");
    }
  };

  const fetchMastDataCount = async () => {
    try {
      const res = await fetch("api/typecount");
      const data = await res.json();
      setmastdate(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const fetchItemDetailCount = async () => {
    try {
      const res = await fetch("api/itemdetailcount");
      const data = await res.json();
      setitemdetailcount(data);
    } catch (err) {
      console.log("Failed to fetch Item Count Records", err);
    }
  };

  useEffect(() => {
    // Simulate loading time (e.g., API call or page assets)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); //  seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchMastDataCount();
    fetchItemDetailCount();
  }, []);

  useEffect(() => {
    console.log(user.user)
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
    setpermissionmorbi(user.user?.pmorbi.includes("read"));
    setpermisson(user.user?.ppermission.includes("read"));
  }, [user]);

  return (
    <>
      {loading ? (<LoadingSpinner />) : (
        <div className="min-h-screen bg-gray-100 px-5 pt-2">
          {/* Header */}
          <header className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded-xl">
            <h1 className="font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
              <h1 className=" font-bold text-gray-800">
                {user.user?.name}
              </h1>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-1  rounded hover:bg-red-600 text-sm"
              >
                {/* Sign Out */}
                <LogOut />
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* Card 1 */}
            <div className=" bg-white text-xs px-2 py-2 rounded-xl shadow">
              <div className="grid grid-cols-2 mb-2 ">
                <h6 className="text-left px-2 font-semibold ">Status :</h6>
                <h6 className="text-right px-2 font-semibold ">{today}</h6>
              </div>
              <div className="py-1 ">
                <table className="w-full font-bold ">
                  <tbody>
                    <tr className="grid grid-cols-2 w-full bg-blue-300 rounded-3xl py-0.5 mb-1">
                      <td className="px-2 font-bold ">Total Hold</td>
                      <td className="text-right px-2 ">
                        {itemdetailcount.totalholdcount}
                      </td>
                    </tr>
                    <tr className="grid grid-cols-2 w-full">
                      <td className=" px-2 ">Today Hold</td>
                      <td className="text-right px-2 ">
                        {itemdetailcount.todayholdcount}
                      </td>
                    </tr>
                    <tr className="grid grid-cols-2 w-full">
                      <td className=" px-2 ">Today Out</td>
                      <td className="text-right px-2 ">
                        {itemdetailcount.todayoutcount}
                      </td>
                    </tr>
                    <tr className="grid grid-cols-2 w-full">
                      <td className=" px-2 ">Today Cancel</td>
                      <td className="text-right px-2 ">
                        {itemdetailcount.todaycancelcount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white text-xs p-4 rounded-xl shadow">
              <div className="grid grid-cols-2 max-w-full ">
                <h2 className=" font-semibold ">Status :</h2>
                <h2 className="text-right font-semibold ">Type</h2>
              </div>
              <table className="w-full my-3 font-bold">
                <tbody>
                  <tr className="grid grid-cols-2 w-full">
                    <td>Regular</td>
                    <td className="text-right font-semibold">
                      {mastdata.regularcount}
                    </td>
                  </tr>
                  <tr className="grid grid-cols-2 w-full">
                    <td>Discontinue</td>
                    <td className="text-right font-semibold">
                      {mastdata.discontinuecount}
                    </td>
                  </tr>
                  <tr className="grid grid-cols-2 w-full">
                    <td>On Order</td>
                    <td className="text-right font-semibold">
                      {mastdata.onordercount}
                    </td>
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
            {permissionitemstatus && (
              <button
                onClick={() => router.push("/stockout")}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                Item Status
              </button>
            )}
            {permissionbreakage && (
              <button
                onClick={() => router.push("/breakage")}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                Breakage
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
            {permissionmorbi && (
              <button
                onClick={() => router.push("/morbi")}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                Morbi
              </button>
            )}
            {permisson && (<button
              onClick={() => router.push("/permission")}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Permission
            </button>)}
          </div>

          {/* Footer */}
          <footer className="mt-10 text-center text-sm text-gray-500">
            &copy; Antica Ceramica. All rights reserved.
          </footer>
        </div>

      )}

    </>
  );
}
