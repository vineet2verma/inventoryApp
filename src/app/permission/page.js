"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { House } from "lucide-react";

const permissionFields = [
    "plocation",
    "ptype",
    "ppaymenttype",
    "pprice",
    "pinventory",
    "pstockin",
    "pcustomer",
    "pbreakage",
    "pitemstatus",
    "pquotation",
];

const actions = ["read","create", "update", "delete"];

export default function PermissionsPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [permissions, setPermissions] = useState({});

    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/getallusers");
            const data = await res.json();
            setUsers(data.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    // When user changes, update permission state
    useEffect(() => {
        const user = users.find((u) => u._id === selectedUserId);
        setSelectedUser(user);
        if (user) {
            const initial = {};
            permissionFields.forEach((field) => {
                initial[field] = user[field] || [];
            });
            setPermissions(initial);
        }
    }, [selectedUserId, users]);

    const handlepermissionchange = (e, field, action) => {
        togglePermission(field, action)

    }

    const togglePermission = (field, action) => {
        setPermissions((prev) => {
            const exists = prev[field]?.includes(action);
            const updated = exists
                ? prev[field].filter((a) => a !== action)
                : [...(prev[field] || []), action];
            return { ...prev, [field]: updated };
        });
    };

    const handleSave = async () => {
        let updatedUser = { ...selectedUser, ...permissions }
        try {
            const res = await fetch(`/api/getallusers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            const result = await res.json();
            if (res.ok) {
                alert("Permissions updated successfully.");
                fetchUsers();
            } else {
                alert("Error updating permissions: " + result.message);
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Server error.");
        }

    };

    return (
        <div className="mx-4">
            <div className="max-w-6xl mx-auto p-4 flex justify-between">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    <House className="w-5 h-5" />
                    Home
                </button>
                <h1 className="text-3xl font-bold mb-2 text-center">User Permission Management</h1>
            </div>

            {/* Dropdown to select user */}
            <div className="mb-2 grid grid-cols-2 gap-2">
                <label className="mt-1.2 px-2 py-4 rounded-2xl  font-medium">Set Permission For </label>
                <select
                    className=" px-2 py-4 rounded-2xl font-bold "
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">-- Select a user --</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Permission Table */}
            {selectedUser && (
                <div className=" ">
                    <h2 className="text-2xl font-semibold grid grid-cols-2 gap-2">
                        <div className="flex mb-2  rounded-2xl bg-gray-600 text-white font-medium ">
                            <p className="px-2" >Selected User: </p>
                            <p className="px-5">{selectedUser.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 ">
                            <button
                                onClick={()=>{alert("Reset Password Link Working")}}
                                className="rounded-2xl mb-2 px-6 bg-blue-600 text-white font-medium  hover:bg-blue-700"
                            >
                                Reset Password
                            </button>
                            <button
                                onClick={handleSave}
                                className="rounded-2xl mb-2 px-6 bg-blue-600 text-white font-medium  hover:bg-blue-700"
                            >
                                Save Permissions
                            </button>
                        </div>

                    </h2>


                    <div className="grid grid-cols-2 gap-2">
                        {permissionFields.map((field) => (
                            <div
                                key={field}
                                className="border rounded px-4 py-4 shadow-sm bg-gray-200 "
                            >
                                <h3 className="font-semibold capitalize mb-3">
                                    {field.replace(/^p/, "")} Permissions
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {actions.map((action) => (
                                        <label key={action} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={permissions[field]?.includes(action)}
                                                onChange={(e) => { handlepermissionchange(e, field, action) }}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                            <span className="capitalize">{action}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    );
}
