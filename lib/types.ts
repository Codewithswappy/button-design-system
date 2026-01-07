import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Enum / Unions ---
export type ButtonState = "default" | "hover" | "active" | "focus" | "disabled" | "loading";
export type GradientType = "linear" | "radial" | "conic";
export type BorderStyle = "solid" | "dashed" | "dotted" | "double" | "none";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export type IconPosition = "left" | "right";
export type IconAnimation = "none" | "spin" | "pulse" | "bounce" | "ping";
export type WidthMode = "auto" | "full" | "fixed";
export type CursorType = "default" | "pointer" | "not-allowed" | "wait" | "text" | "move" | "help";

// --- Primitives ---
export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CornerRadius {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface Shadow {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
  enabled: boolean;
}

export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0-100
  opacity: number; // 0-1
}

export interface Gradient {
  type: GradientType;
  angle: number; // deg
  stops: GradientStop[];
}

export type BackgroundInfo = 
  | { type: 'solid'; value: string }
  | { type: 'gradient'; value: Gradient };

// --- Sub-Configs ---
export interface LayoutConfig {
  padding: Spacing;
  widthMode: WidthMode;
  fixedWidth: number; // px, only if widthMode === 'fixed'
  minWidth: number; // px
  maxWidth: number; // px (0 = none)
  radius: CornerRadius;
  borderWidth: number; // px
  borderStyle: BorderStyle;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: number; // px
  fontWeight: string;
  letterSpacing: number; // em
  lineHeight: number; // unitless
  textTransform: TextTransform;
  textShadow: Shadow[]; // Reusing Shadow but usually inset/spread are ignored
}

export interface IconConfig {
  enabled: boolean;
  svg: string;
  position: IconPosition;
  size: number;
  gap: number;
  color: string | 'inherit'; 
  animation: IconAnimation;
  rotate: number; // deg (static rotation)
}

export interface EffectsConfig {
  backdropBlur: number;
  bgBlur: number;
  borderGradient: Gradient | null;
}

export interface MotionConfig {
  duration: number; // ms
  easing: string; // css easing string
  delay: number; // ms
}

export interface InteractionsConfig {
  ripple: boolean;
  magnetic: boolean;
  magneticStrength: number; // 0-1 usually, roughly maps to px range
  scaleOnPress: number; // e.g. 0.95
}

export interface Transform3D {
  enabled: boolean;
  perspective: number;
  tilt: number;
}

// --- State Definitions ---
export interface StateStyles {
  background: BackgroundInfo;
  textColor: string;
  borderColor: string;
  opacity: number;
  cursor: CursorType;
  shadows: Shadow[];
  ring?: { enabled: boolean; width: number; color: string; offset: number };
  
  // Motion State (Animatable properties)
  transform: {
    scale: number;
    translateY: number;
    translateX: number;
    rotate: number;
    skewX: number;
    skewY: number;
  };
  filter?: {
    blur: number; // px
    brightness: number; // %
    contrast: number; // %
    grayscale: number; // %
  };
}

// --- Root Config ---
export interface ButtonConfig {
  layout: LayoutConfig;
  typography: TypographyConfig;
  icon: IconConfig;
  effects: EffectsConfig;
  motion: MotionConfig;
  interactions: InteractionsConfig;
  transform: Transform3D;
  states: Record<ButtonState, StateStyles>;
}

// --- Initialization ---

export const POPULAR_FONTS = [
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
  { name: 'System', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Geist', value: 'var(--font-geist-sans)' },
  { name: 'Mono', value: 'monospace' },
];

export const createShadow = (): Shadow => ({
    id: Math.random().toString(36).substr(2, 9),
    x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0,0,0,0.1)', inset: false, enabled: true
});

const defaultState: StateStyles = {
  background: { type: 'solid', value: '#18181b' },
  textColor: '#ffffff',
  borderColor: '#27272a',
  opacity: 1,
  cursor: 'pointer',
  shadows: [{ ...createShadow(), spread: 0, blur: 2, y: 1, color: 'rgba(0,0,0,0.05)' }],
  transform: { scale: 1, translateY: 0, translateX: 0, rotate: 0, skewX: 0, skewY: 0 },
  filter: { blur: 0, brightness: 100, contrast: 100, grayscale: 0 }
};

export const INITIAL_CONFIG: ButtonConfig = {
  layout: {
    padding: { top: 12, right: 24, bottom: 12, left: 24 },
    widthMode: 'auto',
    fixedWidth: 120,
    minWidth: 0,
    maxWidth: 0,
    radius: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
    borderWidth: 1,
    borderStyle: 'solid',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 1.5,
    textTransform: 'none',
    textShadow: [],
  },
  icon: {
    enabled: false,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    position: 'left',
    size: 16,
    gap: 8,
    color: 'inherit',
    animation: 'none',
    rotate: 0,
  },
  effects: {
    backdropBlur: 0,
    bgBlur: 0,
    borderGradient: null,
  },
  motion: {
    duration: 200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)", // fast-out-slow-in
    delay: 0,
  },
  interactions: {
    ripple: true,
    magnetic: false,
    magneticStrength: 0.2,
    scaleOnPress: 0.95,
  },
  transform: {
    enabled: false,
    perspective: 1000,
    tilt: 0,
  },
  states: {
    default: defaultState,
    hover: { 
      ...defaultState, 
      background: { type: 'solid', value: '#27272a' }, 
      borderColor: '#3f3f46',
      shadows: [
        { ...createShadow(), y: 1, blur: 2, color: 'rgba(0,0,0,0.05)' },
        { ...createShadow(), y: 4, blur: 6, spread: -1, color: 'rgba(0,0,0,0.1)' }
      ]
    },
    active: { 
      ...defaultState,
      background: { type: 'solid', value: '#18181b' },
      textColor: '#d4d4d8', 
      transform: { ...defaultState.transform, scale: 0.98 },
      shadows: [] 
    },
    focus: {
      ...defaultState,
      ring: { enabled: true, width: 2, color: '#3b82f6', offset: 2 }
    },
    disabled: {
      ...defaultState,
      background: { type: 'solid', value: '#f4f4f5' },
      textColor: '#a1a1aa',
      borderColor: '#e4e4e7',
      shadows: [],
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    loading: {
      ...defaultState,
      opacity: 0.8,
      cursor: 'wait'
    }
  }
};
