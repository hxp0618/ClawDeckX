/**
 * Convert Tailwind color classes from template JSON to inline CSS styles.
 * Tailwind 4.x JIT cannot scan runtime-loaded JSON templates, so dynamic
 * color classes like "from-cyan-500 to-blue-500" or "bg-blue-500" are never
 * compiled into the CSS output. This utility resolves them to inline styles.
 */

const TW_COLORS: Record<string, string> = {
  'red-500': '#ef4444',
  'orange-500': '#f97316',
  'amber-500': '#f59e0b',
  'yellow-500': '#eab308',
  'green-500': '#22c55e',
  'teal-500': '#14b8a6',
  'cyan-500': '#06b6d4',
  'blue-500': '#3b82f6',
  'indigo-500': '#6366f1',
  'purple-500': '#a855f7',
  'pink-500': '#ec4899',
  'slate-500': '#64748b',
};

const DEFAULT_GRADIENT = { from: '#a855f7', to: '#ec4899' }; // purple-500 → pink-500
const DEFAULT_SOLID = '#64748b'; // slate-500

/**
 * Parse a template color string into an inline CSS `background` value.
 *
 * Supported formats:
 *   "from-cyan-500 to-blue-500"   → linear-gradient
 *   "bg-blue-500"                 → solid color
 *   "bg-gradient-to-br from-..."  → linear-gradient (strip prefix)
 */
export function resolveTemplateColor(colorClass: string | undefined): React.CSSProperties {
  if (!colorClass) {
    return { background: `linear-gradient(135deg, ${DEFAULT_GRADIENT.from}, ${DEFAULT_GRADIENT.to})` };
  }

  const tokens = colorClass.trim().split(/\s+/);

  let from: string | null = null;
  let to: string | null = null;
  let solid: string | null = null;

  for (const t of tokens) {
    if (t.startsWith('from-')) {
      from = TW_COLORS[t.slice(5)] ?? null;
    } else if (t.startsWith('to-')) {
      to = TW_COLORS[t.slice(3)] ?? null;
    } else if (t.startsWith('bg-') && !t.startsWith('bg-gradient')) {
      solid = TW_COLORS[t.slice(3)] ?? null;
    }
  }

  if (from && to) {
    return { background: `linear-gradient(135deg, ${from}, ${to})` };
  }
  if (from) {
    return { background: from };
  }
  if (solid) {
    return { background: solid };
  }

  return { background: DEFAULT_SOLID };
}

/**
 * Resolve a template color string to a single hex color (for SVG fill etc.).
 * Returns the "from" color for gradients, or the solid color.
 */
export function resolveTemplateHex(colorClass: string | undefined): string {
  if (!colorClass) return DEFAULT_GRADIENT.from;

  const tokens = colorClass.trim().split(/\s+/);
  for (const t of tokens) {
    if (t.startsWith('from-')) {
      return TW_COLORS[t.slice(5)] ?? DEFAULT_GRADIENT.from;
    }
    if (t.startsWith('bg-') && !t.startsWith('bg-gradient')) {
      return TW_COLORS[t.slice(3)] ?? DEFAULT_SOLID;
    }
  }
  return DEFAULT_SOLID;
}
