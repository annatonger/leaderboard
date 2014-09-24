var fs = require('fs');
var data = JSON.parse(fs.readFileSync('accounts.json'))
var sorted = data.sort(function(a,b) {
    return b.totalvalue - a.totalvalue
})

console.log(sorted)
