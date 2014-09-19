//make an one-dimensional array 
 
var accounts= []
var addresses = ["rKRWe49WhaVcCgp6L5ZDsWMagZzDvw3P9S", "rKRWe49WhaVcCgp6L5ZDsWMagZzDvw3P9S"]

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

var fn=function(i){
	request("http://localhost:5990/v1/accounts/"+accounts[i].address+"/balances", 
	function(error,response,body){
	console.log (body);
	body=JSON.parse(body)
	accounts[i].balances=body.balances
	if (i<accounts.length-1)
		fn(i+1)
	else {
		console.log("done")
		accounts.forEach(function(account){
			console.log(account)
		})
	}
});
}
fn(0);



