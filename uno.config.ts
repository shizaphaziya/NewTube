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
    ['btn-primary', 'px-5 py-2.5 rounded-lg bg-white text-black font-medium transition-all duration-300 hover:bg-white/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm no-underline flex items-center justify-center gap-2'],
    ['btn-secondary', 'px-5 py-2.5 rounded-lg bg-white/5 text-white/80 transition-all duration-300 hover:bg-white/10 active:scale-95 text-sm no-underline flex items-center justify-center gap-2'],
    ['btn-premium', 'px-5 py-2.5 rounded-lg bg-white text-black font-medium transition-all duration-300 hover:bg-white/90 active:scale-95 text-sm no-underline'],
    ['glass-card', 'bg-[#18181b]/50 backdrop-blur-xl border border-white/5 rounded-2xl transition-colors hover:bg-[#18181b]/80'],
    ['glass-panel', 'bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 shadow-xl'],
    ['glass-input', 'bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 transition-all duration-300 focus:(outline-none ring-1 ring-white/30 border-white/30 bg-[#27272a])'],
    ['layout-container', 'max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12'],
    ['nav-link', 'text-white/60 hover:text-white transition-all duration-300 text-sm font-medium no-underline flex items-center gap-3 px-4 py-3 rounded-xl relative group'],
    ['nav-link-active', 'text-white bg-white/10 font-semibold'],
    ['text-gradient', 'bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60'],
    ['surface-elevated', 'bg-[#18181b] border border-white/5 rounded-2xl shadow-xl'],
    ['tag', 'px-3 py-1 rounded-md bg-white/10 text-xs font-medium text-white/80 hover:bg-white/15 transition-colors cursor-pointer'],
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
        sans: 'Inter:400,500,600,700',
        mono: 'DM Mono:400,500',
        brand: 'Inter:400,600,700,800',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      void: {
        DEFAULT: '#09090b',
        surface: '#18181b',
        card: '#27272a',
        accent: '#3f3f46',
      },
    },
    animation: {
      keyframes: {
        'fade-in': '{ from { opacity: 0; } to { opacity: 1; } }',
        'slide-up': '{ from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }',
      },
      durations: {
        'fade-in': '0.3s',
        'slide-up': '0.4s',
      },
      timingFns: {
        'fade-in': 'ease-out',
        'slide-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    }
  }
})
