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
    ['btn-primary', 'px-6 py-3 rounded-xl bg-white text-black font-bold transition-all duration-300 hover:bg-white/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm no-underline'],
    ['btn-secondary', 'px-7 py-3.5 rounded-2xl bg-white/5 text-white/70 border border-white/10 transition-all duration-500 hover:(bg-white/10 text-white border-white/20) active:scale-95 tracking-tight text-xs uppercase no-underline'],
    ['btn-premium', 'px-6 py-3 rounded-xl bg-white text-black font-bold transition-all duration-300 hover:bg-white/90 active:scale-95 text-sm no-underline'],
    ['glass-card', 'bg-white/[0.02] border border-white/[0.05] rounded-2xl transition-colors hover:bg-white/[0.04]'],
    ['glass-panel', 'bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/[0.05] shadow-md'],
    ['glass-input', 'bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 transition-all duration-500 focus:(outline-none ring-1 ring-white/25 bg-white/[0.07] border-white/20)'],
    ['layout-container', 'max-w-screen-2xl mx-auto px-6 lg:px-16'],
    ['nav-link', 'text-white/30 hover:text-white transition-all duration-300 text-[11px] font-bold tracking-[0.15em] uppercase no-underline flex items-center gap-4 px-6 py-4 rounded-2xl relative'],
    ['nav-link-active', 'text-white bg-white/[0.05]'],
    ['text-gradient', 'bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/30'],
    ['surface-elevated', 'bg-[#0f0f0f] border border-white/[0.06] rounded-2xl shadow-md'],
    ['tag', 'px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[10px] font-bold tracking-widest uppercase text-white/30'],
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
        brand: 'Unbounded:400,600,700,900',
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
        surface: '#0A0A0A',
        card: '#111111',
        accent: '#1D1D1F',
      },
      silver: {
        400: '#888888',
        DEFAULT: '#EAEAEA',
        white: '#FFFFFF',
      }
    },
    animation: {
      keyframes: {
        'fade-in-up': '{ from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }',
        'reveal': '{ from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }',
        'shimmer': '{ 100% { transform: translateX(100%); } }',
        'float': '{ 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }'
      },
      durations: {
        'fade-in-up': '0.8s',
        'reveal': '1.2s',
        'shimmer': '2.5s',
        'float': '6s'
      },
      timingFns: {
        'fade-in-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'reveal': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'ease-in-out',
        'float': 'ease-in-out'
      },
      counts: {
        'shimmer': 'infinite',
        'float': 'infinite'
      }
    }
  }
})

