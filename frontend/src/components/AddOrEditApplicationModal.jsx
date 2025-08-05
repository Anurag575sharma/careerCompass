import React, {useState, useEffect} from "react";
import {toast} from "react-hot-toast";

const AddOrEditApplicationModal = ({
  show,
  onClose,
  refreshApplications,
  selectedApp,
}) => {
  const [form, setForm] = useState({
    role: "",
    company: "",
    status: "",
    notes: "",
    dateApplied: "",
  });

  useEffect(() => {
    if (selectedApp) {
      setForm({
        role: selectedApp.role, // ✅ match backend
        company: selectedApp.company,
        status: selectedApp.status,
        notes: selectedApp.notes,
        dateApplied: selectedApp.dateApplied?.slice(0, 10),
      });
    } else {
      setForm({role: "", company: "", status: "", notes: "", dateApplied: ""});
    }
  }, [selectedApp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {role, company, status, dateApplied} = form;
    if (!role || !company || !status || !dateApplied) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const url = selectedApp
        ? `http://localhost:8000/api/applications/${selectedApp._id}`
        : "http://localhost:8000/api/applications";
      const method = selectedApp ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(
          `Application ${selectedApp ? "updated" : "added"} successfully!`
        );
        refreshApplications();
        onClose();
      } else {
        toast.error("Failed to save application.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl mb-4">
          {selectedApp ? "Edit" : "Add New"} Application
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["role", "company", "status", "dateApplied"].map((key) => (
            <div key={key}>
              <label className="block text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                <span className="text-red-500">*</span>
              </label>
              {key === "status" ? (
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({...f, status: e.target.value}))
                  }
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select status</option>
                  {["Applied", "Interview", "Offer", "Rejected"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={key === "dateApplied" ? "date" : "text"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({...f, [key]: e.target.value}))
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({...f, notes: e.target.value}))}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {selectedApp ? "Update" : "Add"} Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrEditApplicationModal;
