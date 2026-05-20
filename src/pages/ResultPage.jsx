import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const SUGAR_DAILY_LIMIT = 50; // gram

const GRADE_COLOR = {
  A: { bg: "#009849", text: "white" },
  B: { bg: "#86BC25", text: "white" },
  C: { bg: "#F7A833", text: "white" },
  D: { bg: "#B71918", text: "white" },
};

const GRADE_MESSAGE = {
  A: { label: "Sangat Baik", desc: "Pilihan yang sangat sehat!" },
  B: { label: "Baik", desc: "Cukup aman untuk dikonsumsi" },
  C: { label: "Sedang", desc: "Perhatikan porsi konsumsinya" },
  D: { label: "Kurang Baik", desc: "Sebaiknya batasi konsumsinya" },
};

function getSugarWarningStyle(pct) {
  if (pct <= 25) return { bg: "#f0fdf4", border: "#bbf7d0", icon: "💚", color: "#15803d", barColor: "#22c55e" };
  if (pct <= 50) return { bg: "#fffbeb", border: "#fde68a", icon: "⚠️", color: "#b45309", barColor: "#f59e0b" };
  if (pct <= 75) return { bg: "#fff7ed", border: "#fed7aa", icon: "🔶", color: "#c2410c", barColor: "#f97316" };
  return { bg: "#fef2f2", border: "#fecaca", icon: "🚨", color: "#b91c1c", barColor: "#ef4444" };
}

// ─── SugarWarningBanner ──────────────────────────────────────────────────────

function SugarWarningBanner({ gulaGram }) {
  const pct = Math.min((gulaGram / SUGAR_DAILY_LIMIT) * 100, 100);
  const pctDisplay = pct.toFixed(0);
  const style = getSugarWarningStyle(pct);

  let kalimat;
  if (pct <= 25) {
    kalimat = `Minuman ini menyumbang ${pctDisplay}% kebutuhan gula harianmu. Masih aman, tapi tetap jaga pola minummu ya!`;
  } else if (pct <= 50) {
    kalimat = `Minuman ini sudah menyumbang ${pctDisplay}% dari batas gula harianmu (${SUGAR_DAILY_LIMIT}g). Perhatikan asupan gulamu di sisa hari ini.`;
  } else if (pct <= 75) {
    kalimat = `Hati-hati! Minuman ini menyumbang ${pctDisplay}% dari batas gula harianmu. Sebaiknya kurangi konsumsi gula tambahan hari ini.`;
  } else {
    kalimat = `Peringatan! Minuman ini saja sudah memenuhi ${pctDisplay}% dari batas gula harianmu. Sangat disarankan untuk tidak mengonsumsinya terlalu sering.`;
  }

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: style.bg, border: `1px solid ${style.border}`, animation: "fadeUp 0.35s ease both" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{style.icon}</span>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: style.color }}>
          Batas Gula Harian
        </p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
            {gulaGram}g dari {SUGAR_DAILY_LIMIT}g
          </span>
          <span className="text-sm font-extrabold" style={{ color: style.color }}>
            {pctDisplay}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "#e2e8f0" }}>
          <div
            className="h-2 rounded-full"
            style={{
              width: `${pct}%`,
              background: style.barColor,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>
      <p className="text-xs leading-relaxed font-medium" style={{ color: style.color }}>
        {kalimat}
      </p>
    </div>
  );
}

// ─── ResultPage ──────────────────────────────────────────────────────────────

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [volume, setVolume] = useState("");
  const [calculated, setCalculated] = useState(null);

  // Ambil data dari navigate state
  const { result, preview } = location.state || {};

  // Guard: kalau user buka /result langsung tanpa data, redirect ke home
  useEffect(() => {
    if (!result || !preview) {
      navigate("/", { replace: true });
    }
  }, [result, preview, navigate]);

  if (!result || !preview) return null;

  const grade = (result.grade || "D").toUpperCase();
  const gradeStyle = GRADE_COLOR[grade] || GRADE_COLOR.D;
  const gradeMsg = GRADE_MESSAGE[grade] || GRADE_MESSAGE.D;

  const handleHitung = () => {
    const vol = parseFloat(volume);
    if (!vol || vol <= 0) return;
    setCalculated({
      gula: parseFloat(((result.gula_per_100ml / 100) * vol).toFixed(1)),
      lemakJenuh: parseFloat(((result.lemak_jenuh_per_100ml / 100) * vol).toFixed(1)),
      vol,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 60%, #eef2ff 100%)",
        fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .result-card { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .hitung-btn { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .hitung-btn:hover { background: #4338ca !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(99,102,241,0.3); }
        .hitung-btn:active { transform: translateY(0); }
        .back-btn { transition: background 0.15s, color 0.15s; }
        .back-btn:hover { background: #e0e7ff; color: #4338ca; }
        .nutrisi-card { transition: transform 0.15s, box-shadow 0.15s; }
        .nutrisi-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.1); }
      `}</style>

      {/* Navbar */}
      <header
        className="w-full border-b sticky top-0 z-10"
        style={{ borderColor: "#e2e8f0", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: "#1e1b4b" }}>
              NutriFriend
            </span>
          </div>
          <button
            className="back-btn text-xs font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1"
            style={{ borderColor: "#c7d2fe", color: "#6366f1", background: "white" }}
            onClick={() => navigate("/")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Scan lagi
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 pb-16">
        <div className="w-full max-w-sm space-y-4">

          {/* Title */}
          <h1
            className="text-2xl font-extrabold tracking-tight result-card"
            style={{ color: "#1e1b4b", animationDelay: "0ms" }}
          >
            Hasil Analisis
          </h1>

          {/* ── Hero card: foto + grade + nama ── */}
          <div
            className="result-card rounded-2xl overflow-hidden shadow-sm"
            style={{ background: "white", border: "1px solid #e2e8f0", animationDelay: "60ms" }}
          >
            <div className="flex gap-4 p-4 items-center">
              {/* Foto produk */}
              <div
                className="flex-shrink-0 rounded-xl overflow-hidden"
                style={{ width: 96, height: 116, border: "1.5px solid #e2e8f0" }}
              >
                <img src={preview} alt="Produk" className="w-full h-full object-cover" />
              </div>

              {/* Grade */}
              <div className="flex-1 flex flex-col gap-2.5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#94a3b8" }}>
                    Grade Nutrisi
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                      style={{ background: gradeStyle.bg }}
                    >
                      <span className="text-xl font-extrabold" style={{ color: gradeStyle.text }}>
                        {grade}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight" style={{ color: "#1e1b4b" }}>
                        {gradeMsg.label}
                      </p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>{gradeMsg.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Confidence badge */}
                {result.confidence && (
                  <div
                    className="self-start px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "#f0f4ff", color: "#6366f1", border: "1px solid #e0e7ff" }}
                  >
                    {result.confidence.toFixed(1)}% akurasi
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: "1px", background: "#f1f5f9" }} />

            {/* Nama produk */}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#94a3b8" }}>
                Nama Produk
              </p>
              <p className="text-base font-bold" style={{ color: "#1e1b4b" }}>
                {result.display_name}
              </p>
            </div>
          </div>

          {/* ── Kandungan per 100ml ── */}
          <div className="result-card" style={{ animationDelay: "120ms" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "#94a3b8" }}>
              Kandungan per 100 ml
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Gula", value: result.gula_per_100ml, accent: "#6366f1", bg: "#f5f3ff", border: "#e0e7ff" },
                { label: "Lemak Jenuh", value: result.lemak_jenuh_per_100ml, accent: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
              ].map(({ label, value, accent, bg, border }) => (
                <div
                  key={label}
                  className="nutrisi-card rounded-2xl p-4"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: "#6b7280" }}>{label}</p>
                  <p className="font-extrabold" style={{ color: accent, fontSize: "1.6rem", lineHeight: 1.1 }}>
                    {value}
                    <span className="text-sm font-semibold ml-1" style={{ color: "#94a3b8" }}>g</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Kalkulator volume ── */}
          <div
            className="result-card rounded-2xl overflow-hidden shadow-sm"
            style={{ background: "white", border: "1px solid #e2e8f0", animationDelay: "180ms" }}
          >
            <div className="px-5 pt-5 pb-4">
              <p className="text-sm font-bold mb-0.5" style={{ color: "#1e1b4b" }}>Kalkulator Volume</p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                Masukkan volume kemasan untuk menghitung total kandungan
              </p>
            </div>

            <div style={{ height: "1px", background: "#f1f5f9" }} />

            <div className="px-5 py-4 space-y-4">
              {/* Input row */}
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 flex items-center rounded-xl border px-3 gap-2"
                  style={{ borderColor: "#c7d2fe", background: "#f8faff" }}
                >
                  <input
                    type="number"
                    min="0"
                    value={volume}
                    onChange={(e) => { setVolume(e.target.value); setCalculated(null); }}
                    placeholder="Contoh: 350"
                    className="flex-1 py-2.5 bg-transparent text-sm font-semibold outline-none"
                    style={{ color: "#1e1b4b" }}
                    onKeyDown={(e) => e.key === "Enter" && handleHitung()}
                  />
                  <span className="text-sm font-medium flex-shrink-0" style={{ color: "#6b7280" }}>ml</span>
                </div>
                <button
                  className="hitung-btn px-5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", border: "none" }}
                  onClick={handleHitung}
                >
                  Hitung
                </button>
              </div>

              {/* Result cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Gula",
                    sublabel: calculated ? `per ${calculated.vol} ml` : "per volume",
                    value: calculated?.gula,
                    activeBg: "#f0fdf4",
                    activeBorder: "#bbf7d0",
                    activeColor: "#16a34a",
                  },
                  {
                    label: "Lemak Jenuh",
                    sublabel: calculated ? `per ${calculated.vol} ml` : "per volume",
                    value: calculated?.lemakJenuh,
                    activeBg: "#fff7ed",
                    activeBorder: "#fed7aa",
                    activeColor: "#ea580c",
                  },
                ].map(({ label, sublabel, value, activeBg, activeBorder, activeColor }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3.5"
                    style={{
                      background: value != null ? activeBg : "#f8faff",
                      border: `1px solid ${value != null ? activeBorder : "#e2e8f0"}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <p className="text-xs font-medium leading-tight mb-1" style={{ color: "#6b7280" }}>
                      {label}
                      <br />
                      <span style={{ color: "#94a3b8" }}>{sublabel}</span>
                    </p>
                    <p
                      className="font-extrabold"
                      style={{
                        color: value != null ? activeColor : "#cbd5e1",
                        fontSize: "1.4rem",
                        lineHeight: 1.1,
                        transition: "color 0.3s",
                      }}
                    >
                      {value != null ? (
                        <>
                          {value}
                          <span className="text-sm font-semibold ml-1" style={{ opacity: 0.7 }}>g</span>
                        </>
                      ) : "—"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sugar warning banner */}
              {calculated && <SugarWarningBanner gulaGram={calculated.gula} />}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ResultPage;
