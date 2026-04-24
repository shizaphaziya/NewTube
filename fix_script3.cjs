const fs = require('fs')

let content = fs.readFileSync('app/pages/watch/[id].vue', 'utf8')

// Is the useProfile hook properly returning isAdmin?
console.log(content.includes('const { profile, isAdmin } = useProfile()'))
