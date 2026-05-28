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
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleClickUpload = () => { if (!isScanning) fileInputRef.current?.click(); };

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

      navigate("/result", { state: { result: data, preview } });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-page min-h-screen flex flex-col font-inter">

      {/* Navbar */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-2">
          <span className="font-jakarta font-extrabold text-lg tracking-tight text-indigo-950">
            NutriFriend
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-3xl p-8 shadow-xl bg-white/92 border border-slate-200/80">

          <h1 className={`font-jakarta text-2xl font-extrabold text-center mb-6 tracking-tight transition-colors duration-300 ${isScanning ? "text-slate-400" : "text-indigo-950"}`}>
            Scan Your Beverages
          </h1>

          {/* Upload / scanning zone */}
          <div
            className={`upload-zone rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden mb-2 h-[220px] transition-all duration-200
              ${isDragging ? "border-indigo-500 bg-indigo-50 scale-[1.01]" : ""}
              ${isScanning ? "is-scanning border-indigo-200 bg-slate-50" : ""}
              ${!isScanning && preview ? "border-indigo-500 bg-indigo-50/30" : ""}
              ${!isScanning && !preview && !isDragging ? "border-indigo-200 bg-slate-50" : ""}
              ${!isScanning ? "cursor-pointer" : ""}
            `}
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
              <img src={preview} alt="Preview minuman" className="w-full h-full object-contain rounded-2xl p-1.5" />
            ) : (
              <div className="flex flex-col items-center gap-3 select-none">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-indigo-100">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                    <circle cx="17" cy="5" r="3" fill="#6366f1" stroke="none" />
                    <path d="M17 3.5v3M15.5 5h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">Klik untuk unggah foto</p>
                <p className="text-xs text-gray-400">atau drag &amp; drop di sini</p>
              </div>
            )}
          </div>

          {/* Hint / error */}
          <div className="h-6 mb-2 flex items-center justify-center">
            {error ? (
              <p className="text-xs font-medium text-red-500 animate-shake">⚠️ {error}</p>
            ) : preview && !isScanning ? (
              <p className="text-xs text-indigo-500">Klik gambar untuk ganti foto</p>
            ) : null}
          </div>

          {/* Scan button */}
          <button
            className={`w-full py-3 rounded-xl font-jakarta font-bold text-sm tracking-wide border-none transition-all duration-200
              ${preview && !isScanning
                ? "bg-linear-to-br from-indigo-500 to-indigo-400 text-white cursor-pointer hover:from-indigo-600 hover:to-indigo-500 hover:-translate-y-px hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            disabled={!preview || isScanning}
            onClick={handleStartScan}
          >
            {isScanning ? "Scanning..." : "Mulai scan"}
          </button>

          <div className="my-4 border-t border-slate-200" />

          {/* Tips button */}
          <div className="flex justify-center">
            <button
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border border-indigo-200 bg-white transition-colors duration-150
                ${isScanning ? "text-slate-400 cursor-not-allowed" : "text-indigo-500 cursor-pointer hover:bg-indigo-100 hover:text-indigo-700"}`}
              onClick={() => !isScanning && setShowTips(true)}
              disabled={isScanning}
            >
              Cara mengambil foto yang benar
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-xs font-bold">?</span>
            </button>
          </div>

        </div>
      </main>

      {showTips && <TipsModal onClose={() => setShowTips(false)} />}
    </div>
  );
}

export default HomePage;
