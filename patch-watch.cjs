const fs = require('fs')

// Fix default.vue blob animation delays
let layout = fs.readFileSync('app/layouts/default.vue', 'utf8')
layout = layout.replace(
  'animate-ambient">',
  'animate-ambient" style="animation-delay: 0s">'
)
layout = layout.replace(
  'animate-ambient" style="animation-delay: -1s">',
  'animate-ambient" style="animation-delay: -7s; animation-direction: alternate-reverse">'
)
layout = layout.replace(
  'animate-ambient" style="animation-delay: -2s">',
  'animate-ambient" style="animation-delay: -13s">'
)
fs.writeFileSync('app/layouts/default.vue', layout)

console.log('layout done')
