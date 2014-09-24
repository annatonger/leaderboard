var request = require("request");
var Queue = require ("queuelib")

var sorted = [];

var initial = new Queue;
var q = new Queue
var q2 = new Queue

var fs = require('fs');
var doc = fs.readFileSync('trade-signup.tsv').toString()
var accounts = [];
var lines = doc.split('\n'); lines.shift() // shift out the first line

initial.forEach(lines,function(line,idx,lib) {
    var columns = line.split('\t')
    if ((columns[2].length) && (columns[2].indexOf('r') != -1))
        accounts.push({username:columns[0],address:columns[2],totalvalue:0}) 
    lib.done()
},function() {
//    accounts = accounts.slice(0,11)
    gettingbalances(0)
})

function gettingbalances (i) {
    console.log("Retrieving balance for "+ accounts[i].username+ " " + accounts[i].address + " (" + i + "/" +(accounts.length-1) + ")")
    if (accounts[i].address.length)
request("http://localhost:5990/v1/accounts/"+accounts[i].address+"/balances", function(error,response,body){
    body=JSON.parse(body)
    console.log(body.balances)
    accounts[i].balances=body.balances
    if (i<accounts.length-1)
        gettingbalances(i+1)
    else {
        q.forEach(accounts, function(account,idx,lib){
            console.log("Calculating total value of balances for account " + account.username + " " + account.address + " ("+idx+"/"+(accounts.length-1)+")")
            q2.forEach(account.balances, function(balance,idx2,lib2){
                if (balance.currency=="XRP") {
                    account.totalvalue+=parseFloat(balance.value)
                    lib2.done()	
                } else if (balance.value!="0") {
                    getexchange(parseFloat(balance.value),
                    balance.currency,balance.counterparty,
                        function(balancevalue){
                            account.totalvalue+=balancevalue
                            lib2.done()
                    })
                } else {
                    lib2.done()
                }
            },function() {
                lib.done()
            })
        },
        function(){
            fs.writeFileSync('accounts.json',JSON.stringify(accounts))
            sorted = accounts.sort(function(a,b) {
                return b.totalvalue - a.totalvalue
            })
        })
    }
});
}

function getexchange(value, basecurrency, baseissuer,callback){
//    console.log("getexchange:",value,basecurrency,baseissuer)
	request.post({
		url:"http://api.ripplecharts.com/api/exchange_rates",
		json: {
			pairs : [
			{
				base : {currency:basecurrency, "issuer":baseissuer},
				counter : {currency:"XRP"}

			}
			]
		}},
		function(error,response,body){
            console.log(body) 
            if (body && body.length)
                callback(value*body[0].rate)
            else 
                callback(0)
		}
	)
}
var currTime = new Date().getTime()
var hour = 1000*60*60
var next = currTime + hour;
var timerid = setInterval(function() {
    currTime = new Date().getTime()
    next = currTime + hour;
    accounts = []
    gettingbalances(0)    
}, hour)
var getSorted = function() {
    return sorted;
}
exports.getSorted = getSorted;
var recalculate = function() {
    clearInterval(timerid);    
    gettingbalances(0)
    timerid = setInterval(function() {
        currTime = new Date().getTime()
        next = currTime + hour;
        accounts = []
        gettingbalances(0)    
    }, hour)
}
exports.recalculate = recalculate;
var nextTime = function() {
    return next
}
exports.nextTime = nextTime;
