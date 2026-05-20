function ScanningOverlay({ preview }) {
  return (
    <div className="relative w-full h-full">
      <img src={preview} alt="Scanning..." className="w-full h-full object-contain" style={{ opacity: 0.28, filter: "grayscale(70%)" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "#e0e7ff" }} />
          <div className="absolute inset-0 rounded-full border-4 border-transparent" style={{ borderTopColor: "#6366f1", animation: "spin 0.85s linear infinite" }} />
        </div>
        <span className="font-extrabold text-xl tracking-tight" style={{ color: "#1e1b4b" }}>
          Scanning...
        </span>
      </div>
    </div>
  );
}

export default ScanningOverlay