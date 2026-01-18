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
  const EMERGENCY_PHONE =
    import.meta.env.VITE_EMERGENCY_PHONE || "+33612380067";

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
      color: "bg-red-50 text-red-800 border-red-200",
      label: "🚨 Critical incident",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    },
    Medium: {
      color: "bg-orange-50 text-orange-800 border-orange-200",
      label: "🟠 Moderate incident",
      glow: "",
    },
    Low: {
      color: "bg-green-50 text-green-800 border-green-200",
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
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        transition: "all 0.3s ease",
        background: darkMode
          ? "linear-gradient(to bottom right, #0f172a, #020617)"
          : "linear-gradient(to bottom right, #f1f5f9, #e5e7eb)",
        color: darkMode ? "#f8fafc" : "#020617",
      }}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl p-8 shadow-xl transition-colors
        ${darkMode ? "bg-slate-900" : "bg-white"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">AI Incident Analyzer</h1>
            <p className="text-sm opacity-70">
              Industrial automated classification system
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-full text-sm border hover:opacity-80 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Textarea */}
        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Incident description
        </label>

        <textarea
          rows={4}
          className={`mt-2 w-full rounded-xl p-4 border text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition
          ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-slate-100"
              : "bg-slate-50 border-gray-300"
          }`}
          placeholder="Describe what happened in detail..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Examples */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs opacity-60">Try examples:</span>

          <button
            onClick={() => setMessage(exampleIncidents.Low)}
            className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 hover:bg-green-200 transition"
          >
            Low
          </button>

          <button
            onClick={() => setMessage(exampleIncidents.Medium)}
            className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
          >
            Medium
          </button>

          <button
            onClick={() => setMessage(exampleIncidents.High)}
            className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            High
          </button>
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyzeIncident}
          disabled={loading || !message}
          className="mt-6 w-full rounded-xl py-3 font-semibold text-white
          bg-blue-600 hover:bg-blue-700 transition
          disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Analyze Severity"}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 rounded-xl border p-5 animate-fade-in
            ${severityMeta[result.severity].color}
            ${severityMeta[result.severity].glow}`}
          >
            <div className="font-semibold mb-2">
              {severityMeta[result.severity].label}
            </div>

            <div className="text-sm mb-1">
              <strong>Category:</strong> {result.category}
            </div>

            <div className="text-sm mb-3">
              <strong>Suggested action:</strong> {result.action}
            </div>

            {result.severity === "High" && (
              <a
                href={`tel:${EMERGENCY_PHONE}`}
                className="block mt-2 text-center bg-red-600 hover:bg-red-700
                text-white py-3 rounded-xl font-bold transition animate-pulse"
              >
                📞 Emergency Call
              </a>
            )}
          </div>
        )}

        {!result && !loading && (
          <p className="mt-6 text-center text-xs opacity-40">
            🤖 Ready to analyze an incident
          </p>
        )}
      </div>
    </div>
  );
}
