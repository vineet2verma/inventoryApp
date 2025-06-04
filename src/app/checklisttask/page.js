"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    mastid: "",
    taskname: "",
    doer: "",
    frequency: "",
    date: "",
    status: "",
    doneby: "",
    actualdate: "",
    remarks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch("/api/checklisttask");
    const json = await res.json();
    if (json.success) {
      const data = json.data;
      setTasks(json.data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModalForCreate = () => {
    setForm({
      mastid: "",
      taskname: "",
      doer: "",
      frequency: "",
      date: "",
      status: "",
      doneby: "",
      actualdate: "",
      remarks: "",
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openModalForEdit = (task) => {
    setForm(task);
    setEditingId(task._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const payload = editingId ? { ...form, _id: editingId } : form;

    const res = await fetch("/api/checklisttask", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowModal(false);
      setForm({
        mastid: "",
        taskname: "",
        doer: "",
        frequency: "",
        date: "",
        status: "",
        doneby: "",
        actualdate: "",
        remarks: "",
      });
      setEditingId(null);
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/task?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchTasks();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          onClick={openModalForCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Create New
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Task Mast ID</th>
              <th className="border px-3 py-2">Task Name</th>
              <th className="border px-3 py-2">Doer</th>
              <th className="border px-3 py-2">Frequency</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Done By</th>
              <th className="border px-3 py-2">Actual Date</th>
              <th className="border px-3 py-2">Remarks</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 text-center">
                  <td className="border px-3 py-2">{task.mastid}</td>
                  <td className="border px-3 py-2">{task.taskname}</td>
                  <td className="border px-3 py-2">{task.doer}</td>
                  <td className="border px-3 py-2">{task.frequency}</td>
                  <td className="border px-3 py-2">{task.data}</td>
                  <td className="border px-3 py-2">{task.status}</td>
                  <td className="border px-3 py-2">{task.doneby}</td>
                  <td className="border px-3 py-2">{task.actualdate}</td>
                  <td className="border px-3 py-2">{task.remarks}</td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => openModalForEdit(task)}
                      className="px-1 text-blue-600 hover:underline"
                    >
                      <Pencil />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-1 text-red-600 hover:underline"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Task" : "Create New Task"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="mastid"
                value={form.mastid}
                onChange={handleChange}
                placeholder="Task Mast ID"
                className="border p-2 rounded"
              />
              <input
                name="taskname"
                value={form.taskname}
                onChange={handleChange}
                placeholder="Task Name"
                className="border p-2 rounded"
              />
              <input
                name="doer"
                value={form.doer}
                onChange={handleChange}
                placeholder="Doer"
                className="border p-2 rounded"
              />
              <input
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                placeholder="Frequency"
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="startdate"
                value={form.date}
                onChange={handleChange}
                placeholder="Date"
                className="border p-2 rounded"
              />
              <input
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="Status"
                className="border p-2 rounded"
              />
              <input
                name="doneby"
                value={form.doneby}
                onChange={handleChange}
                placeholder="Done By"
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="actualdate"
                value={form.actualdate}
                onChange={handleChange}
                placeholder="Actual Date"
                className="border p-2 rounded"
              />
              <input
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Remarks"
                className="border p-2 rounded"
              />

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm({
                      mastid: "",
                      taskname: "",
                      doer: "",
                      frequency: "",
                      date: "",
                      status: "",
                      doneby: "",
                      actualdate: "",
                      remarks: "",
                    });
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
