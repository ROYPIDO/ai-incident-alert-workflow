import { useState } from "react";

type IncidentResult = {
  category: string;
  severity: "Low" | "Medium" | "High";
  action: string;
};

export default function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<IncidentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeIncident = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("http://localhost:5678/webhook/incident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          source: "ui",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Unknown error");
      }

      setResult(data.data);
    } catch (err) {
      console.error("Incident analysis failed:", err);
      alert("Incident analysis failed. Check n8n is running.");
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-orange-400";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">AI Incident Analyzer</h1>

        <textarea
          className="w-full border rounded-md p-3 mb-4"
          rows={4}
          placeholder="Describe the incident..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={analyzeIncident}
          disabled={loading || !message}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Incident"}
        </button>

        {result && (
          <div className="mt-6 border-t pt-4">
            <div className="mb-2">
              <strong>Category:</strong> {result.category}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <strong>Severity:</strong>
              <span
                className={`text-white px-2 py-1 rounded ${severityColor(
                  result.severity
                )}`}
              >
                {result.severity}
              </span>
            </div>

            <div>
              <strong>Suggested action:</strong>
              <p className="mt-1">{result.action}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
