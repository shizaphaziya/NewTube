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
    ['btn-primary', 'px-7 py-3.5 rounded-xl bg-white text-black font-extrabold transition-all duration-300 hover:bg-zinc-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed tracking-tight text-xs uppercase no-underline'],
    ['btn-secondary', 'px-7 py-3.5 rounded-xl bg-white/5 text-white/70 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-95 tracking-tight text-xs uppercase no-underline'],
    ['glass-card', 'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'],
    ['glass-input', 'bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-2.5 text-white placeholder:text-white/20 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.05] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]'],
    ['layout-container', 'max-w-screen-2xl mx-auto px-6 md:px-12'],
    ['nav-link', 'text-white/30 hover:text-white transition-colors duration-300 text-[11px] font-bold tracking-[0.15em] uppercase no-underline'],
    ['surface-elevated', 'bg-[#121214] border border-white/[0.06] rounded-xl'],
    ['tag', 'px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-bold tracking-widest uppercase text-white/30'],
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
        DEFAULT: '#0C0C0E',
        surface: '#121214',
        card: '#18181B',
        accent: '#232328',
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

