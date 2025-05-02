"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientMaster() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [form, setForm] = useState({
    id: "",
    coname: "",
    ordID: "",
    ordDate: "",
    clName: "",
    clMob: "",
    billingAddress: "",
    deliveryAddress: "",
    gstNo: "",
    expectedDeliveryDate: "",
    refBy: "",
    salesPerson: "",
    createdby: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setFilteredClients(
      clients.filter((client) =>
        Object.values(client).some((val) =>
          val?.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }, [search, clients]);

  const fetchClients = async () => {
    const res = await fetch("/api/clientmast");
    const data = await res.json();
    setClients(data);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/clientmast", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      alert(result.message);
      fetchClients();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/clientmast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setIsModalOpen(false);
    setForm({
      id: "",
      coname: "",
      ordID: "",
      ordDate: "",
      clName: "",
      clMob: "",
      billingAddress: "",
      deliveryAddress: "",
      gstNo: "",
      expectedDeliveryDate: "",
      refBy: "",
      salesPerson: "",
      createdby: "",
    });
    fetchClients();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Client Master</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/dashboard")}
        >
          Home
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(form).map((key) => (
                <th key={key} className="border px-2 py-1 text-left capitalize">
                  {key}
                </th>
              ))}
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50">
                {Object.keys(form).map((key) => (
                  <td key={key} className="border px-2 py-1">
                    {client[key]}
                  </td>
                ))}
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Client
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Add Client</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="border p-2 rounded"
                />
              ))}
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
