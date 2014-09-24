//make an one-dimensional array 

var accounts= []
var addresses = ["rKRWe49WhaVcCgp6L5ZDsWMagZzDvw3P9S", "rhgQGpna3XAmstXsq6gSbq3RBBp1UyCuwh"]

//take each item in the addresses list, and push them into the accounts list. 
//name each item address 
addresses.forEach(function(item){
	accounts.push ({address:item,totalvalue:0})
})

//print out the addresses
console.log(accounts)

//install the request module
var request = require("request");
var Q = require ("queuelib")
var q = new Q
var q2 = new Q
//function that starts with "i

var gettingbalances=function(i){
	request("http://localhost:5990/v1/accounts/"+accounts[i].address+"/balances", 
		function(error,response,body){
			console.log (body);
			body=JSON.parse(body)
			accounts[i].balances=body.balances
			if (i<accounts.length-1)
				gettingbalances(i+1)
			else {
				console.log("done")
				q.forEach(accounts,function(account,idx,lib){
					console.log(account,idx)
					q2.forEach(account.balances,function(balance,idx2,lib2){
						console.log(balance,idx2)
						if (balance.currency=="XRP") {
							console.log (balance,idx2)
							account.totalvalue+=parseFloat(balance.value)
							lib2.done()	
						}
						else if (balance.value!="0") {
							getexchange(parseFloat(balance.value),
							balance.currency,balance.counterparty,
							function(balancevalue,name){
								account.totalvalue+=balancevalue
								console.log (balance,idx2)
								lib2.done()
							})
						}

				},function(){console.log ("all done with balances")})
				lib.done()
				},function(){
					console.log ("all done\n\n\n\n")
					console.log (accounts)
				})


				//do the conversion
				/*
				accounts.forEach(function(account,account_idx){
					account.balances.forEach(function(balance,balance_idx){
						if (balance.currency=="XRP") {
							console.log (balance,balance_idx)
							account.totalvalue+=parseFloat(balance.value)
						}
						else if (balance.value!="0") {
							getexchange(parseFloat(balance.value),
							balance.currency,balance.counterparty,
							function(balancevalue,name){
								account.totalvalue+=balancevalue
								console.log (balance,balance_idx)
							})
						}
					})
					
				})
*/
				
			}
	});
}
gettingbalances(0);

//for each account, there is a list of balances

//for each balance, look up the value of each balance in XRP, if not XRP
//add the balances together

function getexchange(value, basecurrency, baseissuer,callback){
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
			console.log("value",value, "rate", body[0].rate, "totalvalue", value*body[0].rate)
			callback(value*body[0].rate,"anna")
		}
	)
}




/*
var convert=function(){
	accounts.forEach(function(account){

		account.balances.forEach( function(object){ 

			if (object.currency != "XRP") {

				getexchange(parseFloat(object.value), object.currency,object.counterparty)

			}
		})
	})
}

*/



