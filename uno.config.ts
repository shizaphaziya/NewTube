import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn-primary', 'relative px-5 py-2.5 rounded-lg bg-primary-600 text-white font-bold transition-all duration-300 hover:(bg-primary-500 shadow-[0_0_25px_rgba(239,68,68,0.4)] -translate-y-0.5) active:(scale-95 translate-y-0) disabled:(opacity-50 cursor-not-allowed) text-sm no-underline flex items-center justify-center gap-2 overflow-hidden'],
    ['btn-secondary', 'relative px-5 py-2.5 rounded-lg bg-theme-border/10 border border-theme-border text-theme-text transition-all duration-300 hover:(bg-theme-border/20 border-theme-border-strong shadow-lg) active:scale-95 text-sm no-underline flex items-center justify-center gap-2'],
    ['btn-icon', 'w-10 h-10 rounded-lg flex items-center justify-center text-theme-text-muted hover:(text-theme-text bg-theme-border shadow-lg) transition-all duration-300 active:scale-90'],
    ['glass-card', 'bg-theme-glass-bg backdrop-blur-xl border border-theme-glass-border rounded-xl transition-all duration-500 hover:(border-primary-500/30 bg-theme-surface shadow-2xl shadow-primary-900/5 dark:shadow-primary-900/20)'],
    ['glass-panel', 'bg-theme-glass-bg backdrop-blur-3xl border border-theme-glass-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]'],
    ['glass-surface', 'bg-theme-glass-bg backdrop-blur-2xl border-b border-theme-glass-border shadow-sm shadow-primary-900/5'],
    ['glass-header', 'bg-theme-glass-bg backdrop-blur-3xl border border-theme-glass-border shadow-xl shadow-primary-900/5'],
    ['glass-input', 'bg-theme-bg border border-theme-border rounded-lg px-4 py-2.5 text-sm text-theme-text placeholder:(text-theme-text-faint) transition-all duration-300 focus:(outline-none border-primary-500/50 bg-theme-surface shadow-[0_0_20px_rgba(239,68,68,0.1)])'],
    ['layout-container', 'max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12'],
    ['nav-link', 'text-theme-text-muted hover:(text-theme-text bg-theme-border) transition-all duration-300 text-[14px] font-medium no-underline flex items-center gap-3 px-3 py-3 rounded-xl relative'],
    ['nav-link-active', 'text-primary-500 dark:text-white bg-primary-500/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)] after:(content-[""] absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)])'],
    ['text-display', 'font-display text-theme-text leading-tight tracking-[-0.02em] font-700'],
    ['tag', 'px-4 py-1.5 rounded-xl border border-theme-border bg-theme-surface-raised text-[11px] font-bold text-theme-text-muted hover:(bg-primary-500 text-white border-primary-400 shadow-lg shadow-primary-900/20) transition-all duration-300 cursor-pointer'],
    ['tag-active', 'bg-primary-500 text-white border-primary-400 shadow-lg shadow-primary-900/30'],
    ['badge-premium', 'px-2 py-0.5 rounded-md bg-gradient-to-tr from-amber-500 to-yellow-300 text-black text-[9px] font-900 uppercase tracking-widest shadow-lg'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700,800,900',
        mono: 'JetBrains Mono:400,500',
        display: 'Outfit:600,700,800',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444', // Main Red
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
      },
      void: {
        50: '#f9fafb',
        100: '#e5e2e1',
        200: '#d1d5db',
        300: '#9ca3af',
        400: '#6b7280',
        500: '#4b5563',
        600: '#374151',
        700: '#1f2937',
        800: '#111827',
        900: '#060a15',
        950: '#02040a',
      },
      theme: {
        bg: 'var(--nt-bg)',
        surface: 'var(--nt-surface)',
        'surface-raised': 'var(--nt-surface-raised)',
        text: 'var(--nt-text)',
        'text-muted': 'var(--nt-text-muted)',
        'text-faint': 'var(--nt-text-faint)',
        border: 'var(--nt-border)',
        'border-strong': 'var(--nt-border-strong)',
        'glass-bg': 'var(--nt-glass-bg)',
        'glass-border': 'var(--nt-glass-border)',
      }
    },
    animation: {
      keyframes: {
        'fade-in': '{ from { opacity: 0; } to { opacity: 1; } }',
        'slide-up': '{ from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
        'scale-in': '{ from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }',
        'glow': '{ 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }',
        'shimmer': '{ from { transform: translateX(-100%); } to { transform: translateX(100%); } }',
      },
      durations: {
        'fade-in': '0.6s',
        'slide-up': '0.6s',
        'scale-in': '0.4s',
        'glow': '2s',
        'shimmer': '2s',
      },
      timingFns: {
        'slide-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    }
  }
})


