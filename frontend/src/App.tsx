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
  const [darkMode, setDarkMode] = useState(false);
  const EMERGENCY_PHONE = import.meta.env.VITE_EMERGENCY_PHONE || "+33612380067";

  const analyzeIncident = async () => {
    try {
      setLoading(true);
      setResult(null);

      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/webhook/incident`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, source: "ui" }),
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

  const severityMeta = {
    High: {
      color: "bg-red-100 text-red-800 border-red-300",
      label: "🚨 Critical incident",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.6)]",
    },
    Medium: {
      color: "bg-orange-100 text-orange-800 border-orange-300",
      label: "🟠 Moderate incident",
      glow: "",
    },
    Low: {
      color: "bg-green-100 text-green-800 border-green-300",
      label: "🟢 Minor / informational",
      glow: "",
    },
  };

  const exampleIncidents = {
    Low: "Minor sensor warning displayed. No impact on production.",
    Medium:
      "Machine overheating warning detected. Production slowed but still running.",
    High: "Emergency stop activated due to safety risk. Production line halted and technician required immediately.",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200"
      }`}
    >
      <div
        className={`rounded-2xl p-8 w-full max-w-2xl transition-all ${
          darkMode ? "bg-slate-900 shadow-xl" : "bg-white shadow-xl"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">AI Incident Analyzer</h1>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-300" : "text-gray-600"
              }`}
            >
              AI-powered industrial incident severity classification
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-1 rounded-full border hover:opacity-80 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Textarea */}
        <textarea
          className={`w-full rounded-xl p-4 mb-4 border
              focus:ring-2 focus:ring-blue-400 focus:outline-none
              text-sm shadow-inner
              ${
                darkMode
                  ? "bg-slate-800 text-slate-100 border-slate-600"
                  : "bg-white text-slate-900 border-gray-300"
              }`}
          rows={4}
          placeholder="Describe the incident..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Quick examples */}
        <div className="flex justify-center gap-3 flex-wrap mb-4">
          <button
            onClick={() => setMessage(exampleIncidents.Low)}
            className="px-4 py-2 rounded-full text-sm font-semibold
                       bg-green-100 text-green-800
                       hover:bg-green-200 hover:scale-105
                       transition transform shadow-sm"
          >
            🟢 Low example
          </button>

          <button
            onClick={() => setMessage(exampleIncidents.Medium)}
            className="px-4 py-2 rounded-full text-sm font-semibold
                       bg-orange-100 text-orange-800
                       hover:bg-orange-200 hover:scale-105
                       transition transform shadow-sm"
          >
            🟠 Medium example
          </button>

          <button
            onClick={() => setMessage(exampleIncidents.High)}
            className="px-4 py-2 rounded-full text-sm font-semibold
                       bg-red-100 text-red-800
                       hover:bg-red-200 hover:scale-105
                       transition transform shadow-sm"
          >
            🚨 High example
          </button>
        </div>

        {/* Analyze button */}
        <button
          onClick={analyzeIncident}
          disabled={loading || !message}
          className="w-full bg-blue-600 hover:bg-blue-700
                     text-white px-4 py-3 rounded-xl
                     font-semibold transition
                     shadow-md hover:shadow-lg
                     disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Incident"}
        </button>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`mt-6 p-5 rounded-xl border
                        animate-[fadeIn_0.4s_ease-out]
                        ${severityMeta[result.severity].color}
                        ${severityMeta[result.severity].glow}`}
          >
            <div className="font-semibold mb-2">
              {severityMeta[result.severity].label}
            </div>

            <div className="mb-1">
              <strong>Category:</strong> {result.category}
            </div>

            <div className="mb-2">
              <strong>Severity:</strong>{" "}
              <span className="font-bold">{result.severity}</span>
            </div>

            <div>
              <strong>Suggested action:</strong>
              <p className="mt-1">{result.action}</p>
            </div>

            {result.severity === "High" && (
              <div className="mt-4 flex flex-col gap-3">
                <div className="text-sm font-semibold text-red-700">
                  ✅ Slack alert sent to operations channel
                </div>

                <a
                  href={`tel:${EMERGENCY_PHONE}`}
                  className="w-full text-center bg-red-600 hover:bg-red-700
                 text-white px-4 py-3 rounded-xl
                 font-bold transition
                 shadow-md hover:shadow-lg
                 animate-pulse"
                >
                  📞 Emergency Call
                </a>

                <p className="text-xs text-red-700 text-center">
                  Direct call to on-call technician
                </p>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <p className="text-xs text-gray-400 mt-2 italic text-center">
            🤖 The AI is bored… give it an incident to analyze.
          </p>
        )}
      </div>
    </div>
  );
}
