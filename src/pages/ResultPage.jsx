import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import SugarWarningBanner from "../components/SugarWarningBanner";

const GRADE_COLOR = {
  A: "#009849",
  B: "#86BC25",
  C: "#F7A833",
  D: "#B71918",
};

const GRADE_MESSAGE = {
  A: { label: "Sangat Baik", desc: "Pilihan yang sangat sehat!" },
  B: { label: "Baik", desc: "Cukup aman untuk dikonsumsi" },
  C: { label: "Sedang", desc: "Perhatikan porsi konsumsinya" },
  D: { label: "Kurang Baik", desc: "Sebaiknya batasi konsumsinya" },
};

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [volume, setVolume] = useState("");
  const [calculated, setCalculated] = useState(null);

  const { result, preview } = location.state || {};

  useEffect(() => {
    if (!result || !preview) navigate("/", { replace: true });
  }, [result, preview, navigate]);

  if (!result || !preview) return null;

  const grade = (result.grade || "D").toUpperCase();
  const gradeColor = GRADE_COLOR[grade] || GRADE_COLOR.D;
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
    <div className="bg-page min-h-screen flex flex-col font-inter">
      {/* Navbar */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-jakarta font-extrabold text-lg tracking-tight text-indigo-950">NutriFriend</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-200 text-indigo-500 bg-white hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-150 cursor-pointer"
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
          <h1 className="font-jakarta text-2xl font-extrabold tracking-tight text-indigo-950 animate-fade-up">Hasil Analisis</h1>

          {/* ── Hero card ── */}
          <div className="animate-fade-up [animation-delay:60ms] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex gap-4 p-4 items-center">
              {/* Foto produk */}
              <div className="shrink-0 w-24 h-[116px] rounded-xl overflow-hidden border border-slate-200">
                <img src={preview} alt="Produk" className="w-full h-full object-cover" />
              </div>

              {/* Grade + confidence */}
              <div className="flex-1 flex flex-col gap-2.5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Grade Nutrisi</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md shrink-0" style={{ background: gradeColor }}>
                      <span className="text-xl font-extrabold text-white">{grade}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-950 leading-tight">{gradeMsg.label}</p>
                      <p className="text-xs text-slate-400">{gradeMsg.desc}</p>
                    </div>
                  </div>
                </div>

                {result.confidence && <span className="self-start px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-500 border border-indigo-100">{result.confidence.toFixed(1)}% akurasi</span>}
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Nama Produk</p>
              <p className="text-base font-bold text-indigo-950">{result.display_name}</p>
            </div>
          </div>

          {/* ── Kandungan per 100ml ── */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Kandungan per 100 ml</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4 bg-violet-50 border border-violet-100">
                <p className="text-xs font-medium text-gray-500 mb-1">Gula</p>
                <p className="text-[1.6rem] font-extrabold leading-none text-indigo-500">
                  {result.gula_per_100ml}
                  <span className="text-sm font-semibold text-slate-400 ml-1">g</span>
                </p>
              </div>
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-100">
                <p className="text-xs font-medium text-gray-500 mb-1">Lemak Jenuh</p>
                <p className="text-[1.6rem] font-extrabold leading-none text-amber-500">
                  {result.lemak_jenuh_per_100ml}
                  <span className="text-sm font-semibold text-slate-400 ml-1">g</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Kalkulator volume ── */}
          <div className="animate-fade-up [animation-delay:180ms] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 pt-5 pb-4">
              <p className="font-jakarta text-sm font-bold text-indigo-950 mb-0.5">Kalkulator Volume</p>
              <p className="text-xs text-slate-400">Masukkan volume kemasan untuk menghitung total kandungan</p>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="px-5 py-4 space-y-4">
              {/* Input row */}
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center rounded-xl border border-indigo-200 bg-slate-50 px-3 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={volume}
                    onChange={(e) => {
                      setVolume(e.target.value);
                      setCalculated(null);
                    }}
                    placeholder="Contoh: 350"
                    className="flex-1 py-2.5 bg-transparent text-sm font-semibold text-indigo-950 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleHitung()}
                  />
                  <span className="text-sm font-medium text-gray-500 shrink-0">ml</span>
                </div>
                <button
                  onClick={handleHitung}
                  className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-br from-indigo-500 to-indigo-400 border-none cursor-pointer hover:from-indigo-600 hover:to-indigo-500 hover:-translate-y-px hover:shadow-md hover:shadow-indigo-200 active:translate-y-0 transition-all duration-200"
                >
                  Hitung
                </button>
              </div>

              {/* Result cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Gula result */}
                <div className={`rounded-xl p-3.5 transition-all duration-300 ${calculated ? "bg-green-50 border border-green-200" : "bg-slate-50 border border-slate-200"}`}>
                  <p className="text-xs font-medium text-gray-500 leading-tight mb-1">
                    Gula
                    <br />
                    <span className="text-slate-400">{calculated ? `per ${calculated.vol} ml` : "per volume"}</span>
                  </p>
                  <p className={`text-[1.4rem] font-extrabold leading-none transition-colors duration-300 ${calculated ? "text-green-600" : "text-slate-300"}`}>
                    {calculated ? (
                      <>
                        {calculated.gula}
                        <span className="text-sm font-semibold ml-1 opacity-70">g</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>

                {/* Lemak jenuh result */}
                <div className={`rounded-xl p-3.5 transition-all duration-300 ${calculated ? "bg-orange-50 border border-orange-200" : "bg-slate-50 border border-slate-200"}`}>
                  <p className="text-xs font-medium text-gray-500 leading-tight mb-1">
                    Lemak Jenuh
                    <br />
                    <span className="text-slate-400">{calculated ? `per ${calculated.vol} ml` : "per volume"}</span>
                  </p>
                  <p className={`text-[1.4rem] font-extrabold leading-none transition-colors duration-300 ${calculated ? "text-orange-600" : "text-slate-300"}`}>
                    {calculated ? (
                      <>
                        {calculated.lemakJenuh}
                        <span className="text-sm font-semibold ml-1 opacity-70">g</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
              </div>

              {/* Sugar warning */}
              {calculated && <SugarWarningBanner gulaGram={calculated.gula} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;
