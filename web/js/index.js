var Queue = require('queuelib')
var q = new Queue;
$(window).ready(function() {
    var url = window.location.href;
    console.log('host:',url)
    $.getJSON(url+'getSorted')
     .done(function(list) {
        var first = list[0];var second = list[1]; var third = list[2];
        $('div#first').html(first.username)
        $('div#second').html(second.username)
        $('div#third').html(third.username)
        var os = "<ol>";
        q.forEach(list,function(account,idx,lib) {
            os += "<li><div class='account'>";
            os += "<div class='balances'><div>"+account.username+"'s holdings</div>";
            for (var i = 0; i < account.balances.length; i++) {
                var balance = account.balances[i];
                os += "<div><span class='currency'>"+balance.currency+"</span>";
                os += "<span class='value'>"+balance.value+"</span></div>";
            }
            os += "</div>"
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
    $.getJSON(url+'nextTime')
    .done(function(time) {
        $('#nextUpdate').html("Next update at " +new Date(time))
    })
})
