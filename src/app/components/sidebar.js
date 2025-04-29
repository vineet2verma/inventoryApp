"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaClock,
    FaExclamationCircle,
    FaList,
    FaMapMarkerAlt,
    FaRulerCombined,
    FaExchangeAlt,
    FaChartBar,
    FaUsers,
    FaClipboardCheck,
    FaRegCalendarAlt,
    FaShoppingCart,
    FaUserTie,
    FaBars,
    FaHome
} from "react-icons/fa";

const menuItems = [
    { title: "Home", icon: FaHome, href: "/dashboard" },
    { title: "Low Stock", icon: FaBoxOpen, href: "/low-stock" },
    { title: "High Stock", icon: FaBoxOpen, href: "/high-stock" },
    { title: "Unused Stock", icon: FaClock, href: "/unused-stock" },
    { title: "Aging Inventory", icon: FaClock, href: "/aging-inventory" },
    { title: "Discontinue Inv List", icon: FaExclamationCircle, href: "/discontinue-inv" },
    { title: "On Order Inv List", icon: FaClipboardCheck, href: "/on-order-inv" },
    { title: "Regular Inv List", icon: FaList, href: "/regular-inv" },
    { title: "Hold Item List", icon: FaExclamationCircle, href: "/hold-items" },
    { title: "Locationwise Inventory List", icon: FaMapMarkerAlt, href: "/location-inv" },
    { title: "Size Wise Inv List", icon: FaRulerCombined, href: "/size-inv" },
    { title: "Daily InOut Report", icon: FaExchangeAlt, href: "/daily-inout" },
    { title: "Weekly In/Out", icon: FaExchangeAlt, href: "/weekly-inout" },
    { title: "Monthly In/Out", icon: FaExchangeAlt, href: "/monthly-inout" },
    { title: "Running Client", icon: FaUsers, href: "/running-client" },
    { title: "Completed Order", icon: FaCheckCircle, href: "/completed-order" },
    { title: "Saleable Items Yearly", icon: FaChartBar, href: "/saleable-yearly" },
    { title: "Saleable Items Half Yearly", icon: FaChartBar, href: "/saleable-half-yearly" },
    { title: "Saleable Items Quarterly", icon: FaChartBar, href: "/saleable-quarterly" },
    { title: "Saleable Items Monthly", icon: FaChartBar, href: "/saleable-monthly" },
    { title: "Saleable Items Weekly", icon: FaChartBar, href: "/saleable-weekly" },
    { title: "Order Placing List", icon: FaShoppingCart, href: "/order-placing" },
    { title: "Ref Wise Client Detail", icon: FaUserTie, href: "/ref-client-detail" },
    { title: "Salesperson-Wise Report", icon: FaUserTie, href: "/salesperson-report" },
];

export default function SideMenu() {
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    return (
        <div className={`h-screen fixed bg-gray-900 text-white p-3 transition-all duration-300 overflow-hidden ${expanded ? 'w-64' : 'w-20  '}`}>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setExpanded(!expanded)} className="text-white text-2xl">
                    <FaBars />
                </button>
            </div>
            <ul className="space-y-2 overflow-y-auto h-[calc(100vh-60px)] pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {menuItems.map(({ title, icon: Icon, href }) => (
                    <li key={title}>
                        <Link
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${router.pathname === href ? "bg-gray-700" : ""
                                }`}
                        >
                            <Icon className="text-lg" />
                            {expanded && <span className="text-sm">{title}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
