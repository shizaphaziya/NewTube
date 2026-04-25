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
    ['btn-primary', 'relative overflow-hidden px-4 py-2 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm no-underline flex items-center justify-center gap-2 group'],
    ['btn-secondary', 'relative overflow-hidden px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 transition-all duration-300 hover:border-neutral-600 hover:text-white hover:bg-neutral-800 active:scale-[0.98] text-sm no-underline flex items-center justify-center gap-2'],
    ['btn-icon', 'w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-300 active:scale-95'],
    ['glass-card', 'bg-neutral-900/40 backdrop-blur-md border border-neutral-800/50 rounded-2xl transition-all duration-500 hover:border-neutral-600/50 hover:bg-neutral-800/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]'],
    ['glass-panel', 'bg-black/60 backdrop-blur-2xl border border-neutral-800/80 shadow-2xl'],
    ['glass-input', 'bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 transition-all duration-300 focus:(outline-none border-neutral-400 bg-neutral-800/80 ring-4 ring-white/10)'],
    ['layout-container', 'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8'],
    ['nav-link', 'text-neutral-400 hover:text-white transition-all duration-300 text-sm font-medium no-underline flex items-center gap-3 px-3 py-2.5 rounded-xl relative group overflow-hidden'],
    ['nav-link-active', 'text-white bg-neutral-800/80 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'],
    ['text-gradient', 'bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60'],
    ['tag', 'px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-[13px] font-medium text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer active:scale-95'],
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
        sans: 'Inter:400,500,600',
        mono: 'JetBrains Mono:400,500',
        brand: 'Inter:600,700,800',
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
        DEFAULT: '#000000',
        surface: '#0a0a0a',
        card: '#111111',
        accent: '#222222',
      },
    },
    animation: {
      keyframes: {
        'fade-in': '{ from { opacity: 0; } to { opacity: 1; } }',
        'slide-up': '{ from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
        'scale-in': '{ from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }',
        'float': '{ 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }',
        'pulse-glow': '{ 0%, 100% { opacity: 0.5; box-shadow: 0 0 20px rgba(255,255,255,0.1); } 50% { opacity: 1; box-shadow: 0 0 40px rgba(255,255,255,0.2); } }',
      },
      durations: {
        'fade-in': '0.6s',
        'slide-up': '0.8s',
        'scale-in': '0.6s',
        'float': '4s',
        'pulse-glow': '3s',
      },
      timingFns: {
        'fade-in': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'ease-in-out',
        'pulse-glow': 'ease-in-out',
      },
    }
  }
})
