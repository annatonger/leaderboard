var argv = require('optimist')
    .usage('Example: node server.js -p 4343')
    .describe('p','port')
    .demand('p')
    .argv;
var http = require('http');
var response = require('response')
var fs = require('fs')
var path = require('path')
var leaderboard = require('./leaderboard')
var ecstatic = require('ecstatic')(path.join(__dirname,'/web'))

var server = http.createServer(function(req,res) {
    switch (req.url) {
        case '/getSorted' :
            response.json(leaderboard.getSorted()).pipe(res) 
            break;
        case '/recalculate' :
            leaderboard.recalculate()
            response.json({ok:true}).pipe(res)
            break;
        case '/nextTime' : 
            response.json(leaderboard.nextTime()).pipe(res)
            break;
        default:
            ecstatic(req,res)
            break;
    }
})
server.listen(argv.p)
