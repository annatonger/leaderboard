

//install the request module
var request = require("request");

request.post({
	url:"http://api.ripplecharts.com/api/exchange_rates",
	json: {
    	pairs : [
        	{
        		base : {currency:"USD", "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"},
            	counter : {currency:"XRP"}

        	}
    	]
	}},
	function(error,response,body){
	console.log (body);
	}
)

