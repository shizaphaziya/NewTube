const fs = require('fs')

let content = fs.readFileSync('app/pages/watch/[id].vue', 'utf8')

console.log(content.includes('v-if="isAdmin"'))
console.log(content.includes('video.value.is_18_plus = newValue'))
