export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
