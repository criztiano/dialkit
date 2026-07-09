// src/range-slider-core.ts
function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
function valueToPercent(v, min, max) {
  if (max === min) return 0;
  return (v - min) / (max - min) * 100;
}
function percentToValue(pct01, min, max) {
  return min + clamp(pct01, 0, 1) * (max - min);
}
function orderRange(v) {
  return v.min <= v.max ? v : { min: v.max, max: v.min };
}
function clampRange(v, min, max) {
  return orderRange({ min: clamp(v.min, min, max), max: clamp(v.max, min, max) });
}
function setLow(nextLow, current, min) {
  return { min: clamp(nextLow, min, current.max), max: current.max };
}
function setHigh(nextHigh, current, max) {
  return { min: current.min, max: clamp(nextHigh, current.min, max) };
}
function shiftSpan(deltaValue, current, min, max) {
  const width = current.max - current.min;
  const desiredMin = clamp(current.min + deltaValue, min, max - width);
  return { min: desiredMin, max: desiredMin + width };
}
function nearestHandle(atValue, current) {
  const dMin = Math.abs(atValue - current.min);
  const dMax = Math.abs(atValue - current.max);
  if (dMin < dMax) return "min";
  if (dMax < dMin) return "max";
  return atValue < current.min ? "min" : "max";
}
function pickDragTarget(atValue, current, hitValue) {
  const nearLow = Math.abs(atValue - current.min) <= hitValue;
  const nearHigh = Math.abs(atValue - current.max) <= hitValue;
  if (nearLow && nearHigh) return nearestHandle(atValue, current);
  if (nearLow) return "min";
  if (nearHigh) return "max";
  if (atValue > current.min && atValue < current.max) return "span";
  return nearestHandle(atValue, current);
}
function isOutsideSpan(atValue, current) {
  return atValue <= current.min || atValue >= current.max;
}
function handleLeftStyles(lowPercent, highPercent) {
  const gap = `(${highPercent}% - ${lowPercent}%)`;
  const ramp = `clamp(0px, calc(30px - ${gap}), 12px)`;
  return {
    low: `max(2px, min(calc(100% - 5px), calc(${lowPercent}% + 6px - ${ramp})))`,
    high: `min(calc(100% - 5px), max(2px, calc(${highPercent}% - 9px + ${ramp})))`
  };
}
export {
  clamp,
  clampRange,
  handleLeftStyles,
  isOutsideSpan,
  nearestHandle,
  orderRange,
  percentToValue,
  pickDragTarget,
  setHigh,
  setLow,
  shiftSpan,
  valueToPercent
};
//# sourceMappingURL=range-slider-core.js.map