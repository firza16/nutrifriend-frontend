const CONTOH_IMAGE = "img/tips-image.png";

const TIPS = [
  "Foto label depan (logo terlihat jelas)",
  "Jarak cukup dekat dengan kamera",
  "Gambar tidak blur (pastikan fokus)",
  "Pencahayaan yang baik",
  "Kemasan lurus menghadap kamera",
];

function TipsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "#e8e8e8" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:text-black hover:bg-white/40 transition-all text-lg font-bold">
          ✕
        </button>
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-base font-bold text-gray-900 text-center">Tips Foto yang Baik 📸</h2>
        </div>
        <div className="mx-4 rounded-xl overflow-hidden bg-white/60" style={{ height: 210 }}>
          <img
            src={CONTOH_IMAGE}
            alt="Contoh foto minuman yang baik"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#888;gap:8px"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" stroke-width="1.5"/><path d="M21 15l-5-5L5 21" stroke-width="1.5"/></svg><span style="font-size:12px">image-contoh.jpg</span></div>`;
            }}
          />
        </div>
        <div className="px-5 py-4">
          <p className="text-sm font-bold text-gray-800 mb-2">Untuk hasil deteksi yang optimal, pastikan:</p>
          <ul className="space-y-1.5">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TipsModal;
