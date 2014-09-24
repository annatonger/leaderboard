var Queue = require('queuelib')
var q = new Queue;
$(window).ready(function() {
    var url = window.location.href;
    console.log('host:',url)
    $.getJSON(url+'getSorted')
     .done(function(list) {
        var os = "<ol>";
        q.forEach(list,function(account,idx,lib) {
            os += "<li><div class='account'>";
            os += "<span class='name'>" + account.username + "</span>"
            os += "<span class='totalvalue'>"+account.totalvalue+"</span>"
            os += "<span class='address'>" + account.address+"</span>"
            os += "</div></li>" 
            lib.done()
        },function() {
            os += "</ol>"
            $('#leaderboard').html(os)
        })
    })
    .error(function(error) {
        console.log(error)
    })
})
