import { ButtonConfig, BackgroundInfo, Gradient, Shadow, StateStyles } from "./types";

export function getBackgroundCSS(bg: BackgroundInfo): string {
    if (bg.type === 'solid') return bg.value;
    
    const { type, angle, stops } = bg.value;
    const stopString = stops.map(s => `${s.color} ${s.position}%`).join(', ');

    if (type === 'radial') {
        return `radial-gradient(circle at center, ${stopString})`;
    }

    if (type === 'conic') {
        return `conic-gradient(from ${angle}deg at 50% 50%, ${stopString})`;
    }
    
    return `linear-gradient(${angle}deg, ${stopString})`;
}

export function getShadowCSS(shadows: Shadow[]): string {
    const active = shadows.filter(s => s.enabled);
    if (active.length === 0) return 'none';
    return active.map(s => 
        `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
    ).join(', ');
}

export function getTextShadowCSS(shadows: Shadow[]): string {
    const active = shadows?.filter(s => s.enabled) ?? [];
    if (active.length === 0) return 'none';
    return active.map(s => 
        `${s.x}px ${s.y}px ${s.blur}px ${s.color}`
    ).join(', ');
}

export function getTransformCSS(config: ButtonConfig, state: keyof ButtonConfig['states']): string {
    const startState = config.states[state]?.transform || { scale: 1, translateY: 0, translateX: 0, rotate: 0, skewX: 0, skewY: 0 };
    const parts = [];
    
    // Global 3D
    if(config.transform.enabled) {
        parts.push(`perspective(${config.transform.perspective}px) rotateX(${config.transform.tilt}deg)`);
    }

    // State Motion
    if(startState.scale !== 1) parts.push(`scale(${startState.scale})`);
    if(startState.translateX !== 0) parts.push(`translateX(${startState.translateX}px)`);
    if(startState.translateY !== 0) parts.push(`translateY(${startState.translateY}px)`);
    if(startState.rotate !== 0) parts.push(`rotate(${startState.rotate}deg)`);
    if(startState.skewX !== 0) parts.push(`skewX(${startState.skewX}deg)`);
    if(startState.skewY !== 0) parts.push(`skewY(${startState.skewY}deg)`);

    return parts.length > 0 ? parts.join(' ') : 'none';
}

export function getFilterCSS(state: StateStyles): string {
    if (!state.filter) return 'none';
    const { blur, brightness, contrast, grayscale } = state.filter;
    const parts = [];
    if (blur > 0) parts.push(`blur(${blur}px)`);
    if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
    if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
    if (grayscale > 0) parts.push(`grayscale(${grayscale}%)`);
    return parts.length > 0 ? parts.join(' ') : 'none';
}

export function generateTailwindClasses(config: ButtonConfig): string {
    const { layout, typography, states, motion, effects } = config;

    // Helper for arbitrary values
    const arb = (val: string | number) => `[${val}]`;
    
    // Helper for gradients in tailwind (spaces to underscores for JIT safety)
    const twGradient = (bg: BackgroundInfo) => {
        if (bg.type === 'solid') return '';
        const css = getBackgroundCSS(bg);
        return css.replace(/\s+/g, '_');
    };

    const classes = [
        // --- Layout ---
        // Width
        layout.widthMode === 'full' ? 'w-full' : layout.widthMode === 'fixed' ? `w-${arb(layout.fixedWidth + 'px')}` : 'w-auto',
        layout.minWidth > 0 ? `min-w-${arb(layout.minWidth + 'px')}` : '',
        layout.maxWidth > 0 ? `max-w-${arb(layout.maxWidth + 'px')}` : '',
        
        // Padding
        layout.padding.top === layout.padding.bottom && layout.padding.left === layout.padding.right && layout.padding.top === layout.padding.left
            ? `p-${arb(layout.padding.top + 'px')}`
            : (
                layout.padding.top === layout.padding.bottom && layout.padding.left === layout.padding.right
                    ? `px-${arb(layout.padding.left + 'px')} py-${arb(layout.padding.top + 'px')}`
                    : `pt-${arb(layout.padding.top + 'px')} pb-${arb(layout.padding.bottom + 'px')} pl-${arb(layout.padding.left + 'px')} pr-${arb(layout.padding.right + 'px')}`
            ),

        // Border Radius
        layout.radius.topLeft === layout.radius.topRight && layout.radius.topLeft === layout.radius.bottomRight && layout.radius.topLeft === layout.radius.bottomLeft
            ? `rounded-${arb(layout.radius.topLeft + 'px')}`
            : `rounded-tl-${arb(layout.radius.topLeft + 'px')} rounded-tr-${arb(layout.radius.topRight + 'px')} rounded-br-${arb(layout.radius.bottomRight + 'px')} rounded-bl-${arb(layout.radius.bottomLeft + 'px')}`,
            
        // Border
        layout.borderWidth > 0 ? `border-${arb(layout.borderWidth + 'px')}` : '',
        layout.borderStyle !== 'solid' ? `border-${layout.borderStyle}` : '',

        // --- Typography ---
        `font-${arb(typography.fontFamily.replace(/\s/g, '_'))}`, 
        `text-${arb(typography.fontSize + 'px')}`,
        `font-${arb(typography.fontWeight)}`,
        `tracking-${arb(typography.letterSpacing + 'em')}`,
        `leading-${arb(typography.lineHeight)}`,
        typography.textTransform !== 'none' ? typography.textTransform : '',

        // --- Effects ---
        effects.backdropBlur > 0 ? `backdrop-blur-${arb(effects.backdropBlur + 'px')}` : '',
        effects.bgBlur > 0 ? `blur-${arb(effects.bgBlur + 'px')}` : '', 

        // --- Animation ---
        `transition-all duration-${arb(motion.duration + 'ms')} ease-${arb(motion.easing)} delay-${arb(motion.delay + 'ms')}`,
        
        // --- States ---
        
        // Default
        states.default.background.type === 'solid' ? `bg-${arb(states.default.background.value)}` : `bg-[${twGradient(states.default.background)}]`,
        `text-${arb(states.default.textColor)}`,
        `border-${arb(states.default.borderColor)}`,
        states.default.opacity !== 1 ? `opacity-${arb(states.default.opacity)}` : '',
        states.default.shadows.length > 0 ? `shadow-[${getShadowCSS(states.default.shadows).replace(/\s/g, '_')}]` : '',
        
        // Hover
        states.hover.background.type === 'solid' ? `hover:bg-${arb(states.hover.background.value)}` : `hover:bg-[${twGradient(states.hover.background)}]`,
        `hover:text-${arb(states.hover.textColor)}`,
        `hover:border-${arb(states.hover.borderColor)}`,
        states.hover.opacity !== 1 ? `hover:opacity-${arb(states.hover.opacity)}` : '',
        states.hover.shadows.length > 0 ? `hover:shadow-[${getShadowCSS(states.hover.shadows).replace(/\s/g, '_')}]` : '',
        
        // Active
        states.active.background.type === 'solid' ? `active:bg-${arb(states.active.background.value)}` : `active:bg-[${twGradient(states.active.background)}]`,
        `active:text-${arb(states.active.textColor)}`,
        `active:border-${arb(states.active.borderColor)}`,
        states.active.opacity !== 1 ? `active:opacity-${arb(states.active.opacity)}` : '',
        
        // Disabled
        states.disabled.background.type === 'solid' ? `disabled:bg-${arb(states.disabled.background.value)}` : `disabled:bg-[${twGradient(states.disabled.background)}]`,
        `disabled:text-${arb(states.disabled.textColor)}`,
        `disabled:border-${arb(states.disabled.borderColor)}`,
        `disabled:opacity-${arb(states.disabled.opacity)}`,
        `disabled:cursor-not-allowed`,

    ].filter(Boolean).join(' ');

    return classes + " " + (config.icon.enabled ? "[&_svg]:stroke-current" : ""); 
}

export function generateCSS(config: ButtonConfig): string {
    const { layout, typography, states, motion, effects, icon } = config;
    
    // Basic Layout Check
    const widthStyle = layout.widthMode === 'full' 
        ? 'width: 100%;' 
        : layout.widthMode === 'fixed' 
            ? `width: ${layout.fixedWidth}px;` 
            : 'width: auto;';

    const css = `
.btn {
  /* Layout */
  padding: ${layout.padding.top}px ${layout.padding.right}px ${layout.padding.bottom}px ${layout.padding.left}px;
  border-radius: ${layout.radius.topLeft}px ${layout.radius.topRight}px ${layout.radius.bottomRight}px ${layout.radius.bottomLeft}px;
  border: ${layout.borderWidth}px ${layout.borderStyle || 'solid'} ${states.default.borderColor};
  ${widthStyle}
  ${layout.minWidth > 0 ? `min-width: ${layout.minWidth}px;` : ''}
  ${layout.maxWidth > 0 ? `max-width: ${layout.maxWidth}px;` : ''}
  
  /* Typography */
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize}px;
  font-weight: ${typography.fontWeight};
  letter-spacing: ${typography.letterSpacing}em;
  line-height: ${typography.lineHeight};
  text-transform: ${typography.textTransform || 'none'};
  text-shadow: ${getTextShadowCSS(typography.textShadow)};
  
  /* Appearance */
  background: ${getBackgroundCSS(states.default.background)};
  color: ${states.default.textColor};
  box-shadow: ${getShadowCSS(states.default.shadows)};
  opacity: ${states.default.opacity};
  filter: ${getFilterCSS(states.default)};
  backdrop-filter: ${effects.backdropBlur > 0 ? `blur(${effects.backdropBlur}px)` : 'none'};
  
  /* Animation */
  transition: all ${motion.duration}ms ${motion.easing} ${motion.delay}ms;
  cursor: ${states.default.cursor || 'pointer'};
  transform: ${getTransformCSS(config, 'default')};
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${icon.gap}px;
  position: relative;
  overflow: hidden; /* For ripple */
  user-select: none;
}

.btn svg {
  width: ${icon.size}px;
  height: ${icon.size}px;
  color: ${icon.color === 'inherit' ? 'currentColor' : icon.color};
  transition: all 200ms ease;
  transform: rotate(${icon.rotate}deg);
  ${icon.animation === 'spin' ? 'animation: spin 1s linear infinite;' : ''}
  ${icon.animation === 'pulse' ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;' : ''}
  ${icon.animation === 'bounce' ? 'animation: bounce 1s infinite;' : ''}
  ${icon.animation === 'ping' ? 'animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}
}

/* State: Hover */
.btn:hover, .btn.is-hover {
  background: ${getBackgroundCSS(states.hover.background)};
  color: ${states.hover.textColor};
  border-color: ${states.hover.borderColor};
  box-shadow: ${getShadowCSS(states.hover.shadows)};
  opacity: ${states.hover.opacity};
  filter: ${getFilterCSS(states.hover)};
  cursor: ${states.hover.cursor || 'pointer'};
  transform: ${getTransformCSS(config, 'hover')};
}

/* State: Active */
.btn:active, .btn.is-active {
  background: ${getBackgroundCSS(states.active.background)};
  color: ${states.active.textColor};
  border-color: ${states.active.borderColor};
  box-shadow: ${getShadowCSS(states.active.shadows)};
  opacity: ${states.active.opacity};
  filter: ${getFilterCSS(states.active)};
  cursor: ${states.active.cursor || 'pointer'};
  transform: ${getTransformCSS(config, 'active')};
}

/* State: Focus */
.btn:focus-visible, .btn.is-focus {
  outline: none;
  box-shadow: ${states.focus.ring?.enabled 
    ? `0 0 0 ${states.focus.ring.offset}px var(--bg-color, white), 0 0 0 ${states.focus.ring.width + states.focus.ring.offset}px ${states.focus.ring.color}` 
    : 'none'};
  filter: ${getFilterCSS(states.focus)};
  cursor: ${states.focus.cursor || 'pointer'};
  transform: ${getTransformCSS(config, 'focus')};
}

/* State: Disabled */
.btn:disabled, .btn.is-disabled {
  background: ${getBackgroundCSS(states.disabled.background)};
  color: ${states.disabled.textColor};
  border-color: ${states.disabled.borderColor};
  box-shadow: ${getShadowCSS(states.disabled.shadows)};
  opacity: ${states.disabled.opacity};
  filter: ${getFilterCSS(states.disabled)};
  cursor: ${states.disabled.cursor || 'not-allowed'};
  transform: ${getTransformCSS(config, 'disabled')};
  pointer-events: none;
}

/* State: Loading */
.btn.is-loading {
    opacity: ${states.loading.opacity};
    cursor: ${states.loading.cursor};
}

/* Keyframes */
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
@keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }

/* Ripple Effect */
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background-color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

`.trim();
    return css;
}
