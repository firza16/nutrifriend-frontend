export function getSugarLevel(pct) {
  if (pct <= 25)
    return {
      wrapperClass: "bg-green-50 border border-green-200",
      titleClass: "text-green-700",
      textClass: "text-green-700",
      pctClass: "text-green-700",
      barColor: "#22c55e",
      icon: "💚",
    };
  if (pct <= 50)
    return {
      wrapperClass: "bg-amber-50 border border-amber-200",
      titleClass: "text-amber-700",
      textClass: "text-amber-700",
      pctClass: "text-amber-700",
      barColor: "#f59e0b",
      icon: "⚠️",
    };
  if (pct <= 75)
    return {
      wrapperClass: "bg-orange-50 border border-orange-200",
      titleClass: "text-orange-700",
      textClass: "text-orange-700",
      pctClass: "text-orange-700",
      barColor: "#f97316",
      icon: "🔶",
    };
  return {
    wrapperClass: "bg-red-50 border border-red-200",
    titleClass: "text-red-700",
    textClass: "text-red-700",
    pctClass: "text-red-700",
    barColor: "#ef4444",
    icon: "🚨",
  };
}