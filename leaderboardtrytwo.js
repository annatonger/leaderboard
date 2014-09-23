//make an one-dimensional array 

var accounts= []
var addresses = ["rKRWe49WhaVcCgp6L5ZDsWMagZzDvw3P9S", "rhgQGpna3XAmstXsq6gSbq3RBBp1UyCuwh"]

//take each item in the addresses list, and push them into the accounts list. 
//name each item address 
addresses.forEach(function(item){
	accounts.push ({address:item})
})

//print out the addresses
console.log(accounts)

//install the request module
var request = require("request");
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
	//do the conversion
	convert(0)
}
});
}
gettingbalances(0);

//for each account, there is a list of balances

//for each balance, look up the value of each balance in XRP, if not XRP
//add the balances together

var nonXRPvalue=[]

var getexchange=function(base, baseissuer){
	request.post({
		url:"http://api.ripplecharts.com/api/exchange_rates",
		json: {
			pairs : [
			{
				base : {currency:base, "issuer":baseissuer},
				counter : {currency:"XRP"}

			}
			]
		}},
		function(error,response,body){
			//console.log (obj.rate, "sexybody");

		//	console.log (body.rate);
			var obj = body[0]
			nonXRPvalue.push(obj.value)
			console.log (body, "sexybody")
			console.log (obj.rate, "sexyrate")
			return Number(obj.rate)
		}
		)
}



var convert=function(){
	accounts.forEach(function(account){

		account.balances.forEach( function(object){ 

			if (object.currency != "XRP") {

				console.log(getexchange(object.currency,object.counterparty), "convertedbalance")

			}
		})
	})
}

setTimeout(function(){
	console.log('accccccounts', accounts[1].balances);
	console.log('sexybalance',nonXRPvalue)
}, 2000);





