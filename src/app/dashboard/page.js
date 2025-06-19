"use client";
import { React, useEffect, useState } from "react";
import SideMenu from "../components/sidebar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginUserFunc } from "@/app/context/loginuser";
import moment from "moment";
import LoadingSpinner from "../components/waiting";
import StatusCountChart from "../components/CrmCountChart";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  // const [sidebarshow, setsidebarshow] = useState(false)
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
  const [permissionquotationimage, setpermissionquotationimage] =
    useState(false);
  const [permissionquotationview, setpermissionquotationview] = useState(false);
  const [permissionmorbi, setpermissionmorbi] = useState(false);
  const [permissioncrm, setpermissioncrm] = useState(false);
  const [permisson, setpermisson] = useState([]);
  const [crmnewdata, setcrmnewdata] = useState([]);
  const [crmstatusdata, setcrmstatusdata] = useState([]);
  const [crmnextfollowup, setcrmnextfollowup] = useState([]);
  const [ crmtotal, setcrmtotal] = useState([]);

  const tdate = new Date();
  const today = moment(tdate).format("DD / MMM / yyyy");

  const { user } = LoginUserFunc();
  const router = useRouter();

  const handleSignOut = async () => {
    let resp = await fetch("api/signout");
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

  const fetchCrmNextFollowUp = async (currentuser) => {
    try {
      const res = await fetch(`api/crmnextfollowupcount?user=${currentuser}`);
      const data = await res.json();
      
      setcrmnextfollowup(data.data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

    const fetchCrmTotal = async (currentuser) => {
    try {
      const res = await fetch(`api/crmtotalcount?user=${currentuser}`);
      const data = await res.json();
      console.log("crm total ",data)
      setcrmtotal(data.data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };


  const fetchCrmEntiesUserWise = async (currentuser) => {
    try {
      // const res = await fetch(`api/crmclient?page=1&user=${currentuser}`);
      const res = await fetch(`api/crmclientcountdatewise?user=${currentuser}`); // crmclient?page=1&user=${currentuser}`);
      const data = await res.json();
      // console.log("aabbcc   => ", `${data.result.alveena}`);
      setcrmnewdata(data);
    } catch (err) {
      console.log("Failed to fetch CRM Count Records", err);
    }
  };

  const fetchCrmStatus = async (currentuser) => {
    try {
      const res = await fetch(`api/crmclientcountstatus?user=${currentuser}`);
      const data = await res.json();
      // console.log("aabbcc   => ", `${data.result.alveena}`);
      setcrmstatusdata(data);
    } catch (err) {
      console.log("Failed to fetch CRM Count Records", err);
    }
  };

  useEffect(() => {
    const currentUser = user.user?.role == "admin" ? "admin" : user.user?.name;
    // setusername(currentUser);
    // console.log("use effect username =>", currentUser);

    // fetchCrmEntiesUserWise(currentUser);
    fetchCrmStatus(currentUser);
    fetchCrmNextFollowUp(currentUser);
    fetchCrmTotal(currentUser)
  }, [user]);

  useEffect(() => {
    // fetchMastDataCount();
    // fetchItemDetailCount();
    setLoading(false);
  }, []);

  useEffect(() => {
    // console.log(user.user);
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
    setpermissionquotationimage(user.user?.pquotationimage.includes("read"));
    setpermissionquotationview(user.user?.pquotationview.includes("read"));
    setpermissionmorbi(user.user?.pmorbi.includes("read"));
    setpermisson(user.user?.ppermission.includes("read"));
    setpermissioncrm(user.user?.pcrm.includes("read"));
  }, [user]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {user.user?.role == "admin" && <SideMenu />}
          <div className={`min-h-screen pl-18 bg-gray-100 px-5 pt-2`}>
            {/* Header */}
            <header className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded-xl">
              <h1 className="font-bold text-gray-800">Dashboard</h1>
              <div className="flex items-center gap-4">
                <h1 className=" font-bold text-gray-800">{user.user?.name}</h1>
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
              {/* Notification 1 */}
              {/* <div className=" bg-white text-xs px-2 py-2 rounded-xl shadow">
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
              </div> */}

              {/* Notification 2 */}
              {/* <div className="bg-white text-xs p-4 rounded-xl shadow">
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
              </div> */}

              <div className="bg-white text-xs p-4 rounded-xl shadow">
                <div className="grid grid-cols-2 max-w-full ">
                  <h2 className=" font-semibold ">Status :</h2>
                  <h2 className="text-right font-semibold ">CRM Follow Up</h2>
                </div>
                <table className="w-full my-3 font-bold">
                  <tbody>
                    {Object.entries(crmnextfollowup).map(
                      ([label, count], index) => (
                        <tr key={index}>
                          <td className="">{label}</td>
                          <td className="text-right">{count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-white text-xs p-4 rounded-xl shadow">
                <div className="grid grid-cols-2 max-w-full ">
                  <h2 className=" font-semibold ">Status :</h2>
                  <h2 className="text-right font-semibold ">Crm Task</h2>
                </div>
                <table className="w-full my-3 font-bold">
                  <tbody>
                    {Object.entries(crmtotal).map(
                      ([label, count], index) => (
                        <tr key={index}>
                          <td className="">{label}</td>
                          <td className="text-right">{count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* <div className="bg-white p-2 rounded-xl shadow">
                <StatusCountChart
                  apiData={crmnewdata}
                  username={user.user?.name}
                />
              </div> */}

              {/* <div className="bg-white p-2 rounded-xl shadow">
                <StatusCountChart
                  apiData={crmstatusdata}
                  username={user.user?.name}
                />
              </div> */}
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
              {permissionquotationimage && (
                <button
                  onClick={() => router.push("/quotationimage")}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  Quotation Image
                </button>
              )}
              {permissionquotationview && (
                <button
                  onClick={() => router.push("/view-quotation")}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  Quotation View
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
              {permisson && (
                <button
                  onClick={() => router.push("/permission")}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  Permission
                </button>
              )}
              {permissioncrm && (
                <button
                  onClick={() => router.push("/crm")}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  CRM
                </button>
              )}
              {user.user?.role == "admin" && (
                <button
                  onClick={() => router.push("/checklistmast")}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  Checklist Mast
                </button>
              )}
              {user.user?.role == "admin" && (
                <button
                  onClick={() => router.push("/checklisttask")}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  Checklist Task
                </button>
              )}
            </div>

            {/* Footer */}
            <footer className="mt-10 text-center text-sm text-gray-500">
              &copy; Antica Ceramica. All rights reserved.
            </footer>
          </div>
        </>
      )}
    </>
  );
}
