"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle, ArrowLeft } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function TileMasterPage() {
  const [tiles, setTiles] = useState([]);
  const [formData, setFormData] = useState({ tile: "", createdBy: "", status: "Active", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    const res = await fetch("/api/tilemast");
    const data = await res.json();
    setTiles(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const payload = editingId ? { ...formData, id: editingId } : formData;

    const res = await fetch("/api/tilemast", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchTiles();
      setFormData({ tile: "", createdBy: "", status: "Active", imageUrl: "" });
      setEditingId(null);
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch("/api/tilemast", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTiles();
  };

  const handleEdit = (tile) => {
    setFormData({ tile: tile.tile, createdBy: tile.createdBy, status: tile.status, imageUrl: tile.imageUrl });
    setEditingId(tile._id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <button
          onClick={() => {
            setFormData({ tile: "", createdBy: "", status: "Active", imageUrl: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Add Tile
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-white shadow rounded-xl space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Tile</label>
            <input
              type="text"
              value={formData.tile}
              onChange={(e) => setFormData({ ...formData, tile: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created By</label>
            <input
              type="text"
              value={formData.createdBy}
              onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-xl"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              {editingId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)} // Close the form
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full table-auto">
          <thead className="text-left text-sm font-semibold text-gray-600 border-b">
            <tr>
              <th className="p-2">Tile</th>
              <th className="p-2">Created By</th>
              <th className="p-2">Status</th>
              <th className="p-2">Image</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {tiles.map((tile, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{tile.tile}</td>
                <td className="p-2">{tile.createdBy}</td>
                <td className="p-2">{tile.status}</td>
                <td className="p-2">
                  {tile.imageUrl ? (
                    <img src={tile.imageUrl} alt="Tile" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-2">{moment(tile.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(tile)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(tile._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {tiles.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}