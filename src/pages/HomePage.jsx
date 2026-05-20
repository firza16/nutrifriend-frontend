import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import TipsModal from "../components/TipsModal";
import ScanningOverlay from "../components/ScanningOverlay";

function HomePage() {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleClickUpload = () => {
    if (!isScanning) fileInputRef.current?.click();
  };

  const handleStartScan = async () => {
    if (!imageFile || isScanning) return;
    setIsScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("https://firzahakim-nutrifriend.hf.space/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (data.status !== "success") throw new Error(data.message || "Prediksi gagal");

      navigate("/result", {
        state: {
          result: data,
          preview,
        },
      });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
      setIsScanning(false);
    }
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
        @keyframes spin { to { transform: rotate(360deg); } }

        .upload-zone { transition: border-color 0.2s, background 0.2s, transform 0.15s; }
        .upload-zone:hover:not(.is-scanning) { border-color: #6366f1; background: #f5f3ff; transform: scale(1.005); }
        .upload-zone.dragging { border-color: #6366f1; background: #ede9fe; transform: scale(1.01); }

        .scan-btn { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .scan-btn:not(:disabled):hover { background: #4338ca !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.35); }
        .scan-btn:not(:disabled):active { transform: translateY(0); }

        .tips-btn { transition: background 0.15s, color 0.15s; }
        .tips-btn:hover:not(:disabled) { background: #e0e7ff; color: #4338ca; }

        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
        .error-shake { animation: shake 0.4s ease; }
      `}</style>

      {/* Navbar */}
      <header className="w-full border-b" style={{ borderColor: "#e2e8f0", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: "#1e1b4b" }}>
            NutriFriend
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-3xl p-8 shadow-xl" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(226,232,240,0.8)" }}>
          <h1 className="text-2xl font-extrabold text-center mb-6 tracking-tight" style={{ color: isScanning ? "#94a3b8" : "#1e1b4b", transition: "color 0.4s" }}>
            Scan Your Beverages
          </h1>

          {/* Upload / scanning zone */}
          <div
            className={`upload-zone rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden mb-2 ${isDragging ? "dragging" : ""} ${isScanning ? "is-scanning" : "cursor-pointer"}`}
            style={{
              borderColor: isScanning ? "#c7d2fe" : preview ? "#6366f1" : "#c7d2fe",
              background: isScanning ? "#f8faff" : preview ? "#f8f7ff" : "#f8faff",
              height: 220,
            }}
            onClick={isScanning ? undefined : handleClickUpload}
            onDrop={isScanning ? undefined : handleDrop}
            onDragOver={isScanning ? undefined : handleDragOver}
            onDragLeave={isScanning ? undefined : handleDragLeave}
            role={isScanning ? undefined : "button"}
            tabIndex={isScanning ? undefined : 0}
            onKeyDown={(e) => !isScanning && e.key === "Enter" && handleClickUpload()}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

            {isScanning ? (
              <ScanningOverlay preview={preview} />
            ) : preview ? (
              <img src={preview} alt="Preview minuman" className="w-full h-full object-contain rounded-2xl" style={{ padding: "6px" }} />
            ) : (
              <div className="flex flex-col items-center gap-3 select-none">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#e0e7ff" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                    <circle cx="17" cy="5" r="3" fill="#6366f1" stroke="none" />
                    <path d="M17 3.5v3M15.5 5h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
                  Klik untuk unggah foto
                </p>
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  atau drag &amp; drop di sini
                </p>
              </div>
            )}
          </div>

          {/* Hint / error */}
          <div className="h-6 mb-2 flex items-center justify-center">
            {error ? (
              <p className="text-xs font-medium error-shake" style={{ color: "#ef4444" }}>
                ⚠️ {error}
              </p>
            ) : preview && !isScanning ? (
              <p className="text-xs" style={{ color: "#6366f1" }}>
                Klik gambar untuk ganti foto
              </p>
            ) : null}
          </div>

          {/* Scan button */}
          <button
            className="scan-btn w-full py-3 rounded-xl font-bold text-sm tracking-wide"
            style={{
              background: preview && !isScanning ? "linear-gradient(135deg, #6366f1, #818cf8)" : "#e2e8f0",
              color: preview && !isScanning ? "white" : "#94a3b8",
              cursor: preview && !isScanning ? "pointer" : "not-allowed",
              border: "none",
            }}
            disabled={!preview || isScanning}
            onClick={handleStartScan}
          >
            {isScanning ? "Scanning..." : "Mulai scan"}
          </button>

          <div className="my-4 border-t" style={{ borderColor: "#e2e8f0" }} />

          {/* Tips button */}
          <div className="flex justify-center">
            <button
              className="tips-btn flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border"
              style={{
                borderColor: "#c7d2fe",
                color: isScanning ? "#94a3b8" : "#6366f1",
                background: "white",
                cursor: isScanning ? "not-allowed" : "pointer",
              }}
              onClick={() => !isScanning && setShowTips(true)}
              disabled={isScanning}
            >
              Cara mengambil foto yang benar
              <span className="w-4 h-4 rounded-full border flex items-center justify-center text-xs font-bold" style={{ borderColor: "currentColor" }}>
                ?
              </span>
            </button>
          </div>
        </div>
      </main>

      {showTips && <TipsModal onClose={() => setShowTips(false)} />}
    </div>
  );
}

export default HomePage;
