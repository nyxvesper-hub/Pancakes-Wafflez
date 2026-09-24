/**
 * Hand-drawn SVG icons for Pancakes & Wafflez.
 * All icons use `currentColor` so they inherit the parent's text color.
 * Each is stroke-based with rounded caps for a warm, illustrated feel —
 * NOT the generic flat outline-icon look.
 */
import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

/* ---- Whisk (bakery tool) ---- */
export function Whisk(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Handle */}
      <path d="M14 4 L18 8" />
      <path d="M15 5 L19 9" />
      <path d="M16 4 L20 8" />
      <path d="M14 6 L18 10" />
      {/* Bottom balloon of wires */}
      <path d="M14 10 C 12 14, 14 18, 18 18" />
      <path d="M16 8 C 14 12, 16 16, 20 16" />
      <path d="M18 6 C 16 10, 18 14, 22 14" />
    </svg>
  );
}

/* ---- Mint sprig (for tea garnish / botanical accent) ---- */
export function MintSprig(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Stem */}
      <path d="M12 22 L12 8" />
      {/* Leaves (pairs) */}
      <path d="M12 18 C 8 18, 6 16, 6 13 C 10 13, 12 15, 12 18 Z" />
      <path d="M12 18 C 16 18, 18 16, 18 13 C 14 13, 12 15, 12 18 Z" />
      <path d="M12 14 C 8.5 14, 7 12, 7 9.5 C 10.5 9.5, 12 11.5, 12 14 Z" />
      <path d="M12 14 C 15.5 14, 17 12, 17 9.5 C 13.5 9.5, 12 11.5, 12 14 Z" />
      <path d="M12 10 C 10 10, 9 9, 9 7.5 C 11 7.5, 12 8.5, 12 10 Z" />
      <path d="M12 10 C 14 10, 15 9, 15 7.5 C 13 7.5, 12 8.5, 12 10 Z" />
    </svg>
  );
}

/* ---- Coffee cup with rising steam ---- */
export function CoffeeCup(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Saucer */}
      <path d="M5 19 L19 19" />
      {/* Cup body */}
      <path d="M5 10 L6 18 L14 18 L15 10 Z" />
      {/* Coffee surface */}
      <path d="M5.3 11 L14.7 11" strokeWidth={1.2} />
      {/* Handle */}
      <path d="M15 11 C 18 11, 18 15, 15 15" />
      {/* Steam */}
      <path
        d="M8 8 C 7 7, 8 6, 7.5 5"
        strokeWidth={1.2}
        opacity={0.7}
      />
      <path
        d="M11 8 C 10 7, 11 6, 10.5 5"
        strokeWidth={1.2}
        opacity={0.7}
      />
      <path
        d="M14 8 C 13 7, 14 6, 13.5 5"
        strokeWidth={1.2}
        opacity={0.7}
      />
    </svg>
  );
}

/* ---- Fork & knife crossed (for menu headers) ---- */
export function ForkKnife(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Fork (left, tilted) */}
      <path d="M9 4 L9 9" />
      <path d="M7 4 L7 8" />
      <path d="M11 4 L11 8" />
      <path d="M9 9 L9 20" />
      {/* Knife (right, tilted) */}
      <path d="M16 4 C 18 6, 17 9, 15 9.5 L15 20" />
    </svg>
  );
}

/* ---- Olive branch (Moroccan botanical motif) ---- */
export function OliveBranch(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Branch stem */}
      <path d="M3 20 C 8 16, 14 12, 21 5" />
      {/* Leaves along the stem */}
      <ellipse cx="6" cy="17" rx="2" ry="1" transform="rotate(-30 6 17)" />
      <ellipse cx="10" cy="14" rx="2" ry="1" transform="rotate(-30 10 14)" />
      <ellipse cx="14" cy="11" rx="2" ry="1" transform="rotate(-30 14 11)" />
      <ellipse cx="18" cy="8" rx="2" ry="1" transform="rotate(-30 18 8)" />
      {/* Olives (small circles) */}
      <circle cx="9" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="13" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="9" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---- Pancake stack (for hero / menu accent) ---- */
export function PancakeStack(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Bottom pancake */}
      <ellipse cx="12" cy="17" rx="9" ry="2.2" />
      {/* Middle pancake */}
      <ellipse cx="12" cy="14" rx="8" ry="2" />
      {/* Top pancake */}
      <ellipse cx="12" cy="11" rx="7" ry="1.8" />
      {/* Butter square on top */}
      <rect x="10.5" y="8" width="3" height="2.5" rx="0.3" />
      {/* Syrup drip */}
      <path d="M9 10 C 9 12, 9 13, 9.5 13" />
      <path d="M14 10 C 14 12, 14 13, 13.5 13" />
    </svg>
  );
}

/* ---- Waffle (for menu header) ---- */
export function Waffle(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Square waffle outline */}
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      {/* Grid pattern (3x3) */}
      <path d="M4 9.3 L20 9.3" />
      <path d="M4 14.6 L20 14.6" />
      <path d="M9.3 4 L9.3 20" />
      <path d="M14.6 4 L14.6 20" />
      {/* Little butter cube on top */}
      <rect x="10" y="9" width="4" height="2" rx="0.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---- Wheat stalk (for bakery section) ---- */
export function Wheat(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Central stem */}
      <path d="M12 22 L12 4" />
      {/* Grain pairs going up — alternating sides */}
      <path d="M12 18 C 9 18, 8 16, 8 14 C 10 14, 12 16, 12 18 Z" />
      <path d="M12 18 C 15 18, 16 16, 16 14 C 14 14, 12 16, 12 18 Z" />
      <path d="M12 14 C 9.5 14, 8.5 12, 8.5 10 C 10.5 10, 12 12, 12 14 Z" />
      <path d="M12 14 C 14.5 14, 15.5 12, 15.5 10 C 13.5 10, 12 12, 12 14 Z" />
      <path d="M12 10 C 10 10, 9 8, 9 6.5 C 11 6.5, 12 8, 12 10 Z" />
      <path d="M12 10 C 14 10, 15 8, 15 6.5 C 13 6.5, 12 8, 12 10 Z" />
      {/* Top grain */}
      <path d="M12 6 L12 4" />
    </svg>
  );
}

/* ---- Clock (for hours / find us) ---- */
export function Clock(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 L12 12 L16 13" />
    </svg>
  );
}

/* ---- Pin (for location) ---- */
export function Pin(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 22 C 12 22, 5 14, 5 9.5 A 7 7 0 0 1 19 9.5 C 19 14, 12 22, 12 22 Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/* ---- WhatsApp glyph (for order button) ---- */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2.06a9.95 9.95 0 0 0-8.49 15.18L2 22l4.86-1.27a9.95 9.95 0 0 0 5.18 1.4h.004a9.95 9.95 0 0 0 0-19.9zm0 18.13h-.004a8.21 8.21 0 0 1-4.19-1.15l-.3-.18-3.06.8.82-2.99-.2-.31a8.23 8.23 0 1 1 6.94 3.83zm4.52-6.13c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.06 0 1.22.89 2.39 1.01 2.55.12.17 1.74 2.66 4.21 3.73.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

/* ---- Instagram glyph ---- */
export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.39-.32-1.71a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32-1.24-.06-1.59-.07-4.74-.07zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92zm0 9a3.54 3.54 0 1 0 0-7.08 3.54 3.54 0 0 0 0 7.08zm5.65-9.21a1.27 1.27 0 1 1-2.55 0 1.27 1.27 0 0 1 2.55 0z" />
    </svg>
  );
}

/* ---- Star divider (small decorative star, used between menu categories) ---- */
export function StarDivider(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" />
    </svg>
  );
}

/* ---- Zellige-inspired tile divider (a TASTEFUL small accent — used once or twice max) ---- */
/* Eight-pointed star — classic Moroccan motif, but rendered as line art only */
export function ZelligeStar(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      {/* Two overlapping squares = 8-pointed star */}
      <rect x="4" y="4" width="16" height="16" rx="1" transform="rotate(0 12 12)" />
      <rect x="4" y="4" width="16" height="16" rx="1" transform="rotate(45 12 12)" />
      {/* Center small octagon */}
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

/* ---- Heart (for the "made with love" footer mark) ---- */
export function Heart(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M12 21 C 12 21, 3 14, 3 8.5 A 4.5 4.5 0 0 1 12 5.5 A 4.5 4.5 0 0 1 21 8.5 C 21 14, 12 21, 12 21 Z"
        strokeWidth={1.6}
      />
    </svg>
  );
}
