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
    ['btn-primary', 'px-4 py-2 rounded-md bg-white text-black font-medium transition-all duration-200 hover:bg-neutral-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm no-underline flex items-center justify-center gap-2'],
    ['btn-secondary', 'px-4 py-2 rounded-md bg-transparent border border-neutral-800 text-neutral-300 transition-all duration-200 hover:bg-neutral-900 hover:text-white active:scale-95 text-sm no-underline flex items-center justify-center gap-2'],
    ['btn-premium', 'px-4 py-2 rounded-md bg-white text-black font-medium transition-all duration-200 hover:bg-neutral-200 active:scale-95 text-sm no-underline'],
    ['glass-card', 'bg-black border border-neutral-800 rounded-xl transition-colors hover:border-neutral-700'],
    ['glass-panel', 'bg-black/80 backdrop-blur-xl border border-neutral-800 shadow-2xl'],
    ['glass-input', 'bg-transparent border border-neutral-800 rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-500 transition-all duration-200 focus:(outline-none border-neutral-500 bg-neutral-900/50)'],
    ['layout-container', 'max-w-[1400px] mx-auto px-4 md:px-8'],
    ['nav-link', 'text-neutral-400 hover:text-white transition-all duration-200 text-sm font-medium no-underline flex items-center gap-3 px-3 py-2 rounded-md relative group'],
    ['nav-link-active', 'text-white bg-neutral-900 font-medium'],
    ['text-gradient', 'bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400'],
    ['surface-elevated', 'bg-neutral-950 border border-neutral-800 rounded-xl shadow-xl'],
    ['tag', 'px-2.5 py-1 rounded border border-neutral-800 bg-transparent text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer'],
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
        brand: 'Inter:600,700',
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
        'slide-up': '{ from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }',
        'scale-in': '{ from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }',
      },
      durations: {
        'fade-in': '0.4s',
        'slide-up': '0.5s',
        'scale-in': '0.4s',
      },
      timingFns: {
        'fade-in': 'ease-out',
        'slide-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    }
  }
})
