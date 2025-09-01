import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const Symptoms = () => {
  const { accessToken } = useAuth();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const res = await axios.post(
        "/symptoms",
        { symptoms: input.split(",").map((s) => s.trim()) },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setDiagnosis(res.data.diagnosis);
    } catch (err) {
      console.error("Diagnosis error:", err);
      setError("Failed to fetch diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Symptom Checker</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows="3"
          placeholder="Enter your symptoms (comma-separated)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Get Diagnosis"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {diagnosis && (
        <div
          className="mt-6 bg-white shadow rounded-lg p-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: diagnosis }}
        />
      )}
    </div>
  );
};

export default Symptoms;
