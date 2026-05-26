import { getSugarLevel } from "../utils/sugarUtils";

const SUGAR_DAILY_LIMIT = 50;

function SugarWarningBanner({ gulaGram }) {
  const pct = Math.min((gulaGram / SUGAR_DAILY_LIMIT) * 100, 100);
  const pctDisplay = pct.toFixed(0);
  const level = getSugarLevel(pct);

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
    <div className={`rounded-2xl p-4 space-y-3 animate-fade-up ${level.wrapperClass}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{level.icon}</span>
        <p className={`text-xs font-bold uppercase tracking-widest ${level.titleClass}`}>Batas Gula Harian</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-gray-500">
            {gulaGram}g dari {SUGAR_DAILY_LIMIT}g
          </span>
          <span className={`text-sm font-extrabold ${level.pctClass}`}>{pctDisplay}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200">
          <div className="progress-bar" style={{ width: `${pct}%`, background: level.barColor }} />
        </div>
      </div>

      <p className={`text-xs leading-relaxed font-medium ${level.textClass}`}>{kalimat}</p>
    </div>
  );
}

export default SugarWarningBanner;