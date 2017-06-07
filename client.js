let unirest = require("unirest");

let signUp = function(name, email, cpf, password) {

	let req = unirest("POST", "https://brlet.herokuapp.com/users/signUp");

	req.headers({
	  "cache-control": "no-cache",
	  "content-type": "application/x-www-form-urlencoded"
	});

	req.form({
	  "password": password,
	  "name": name,
	  "cpf": cpf,
	  "email": email
	});

	req.end(function (res) {
	  //if (res.error) throw new Error(res.error);
	 	console.log(res.status);
	 	console.log(res.body);
	});
}

let restoreBitcoinWallet = function() {
	let req = unirest("GET", "https://brlet.herokuapp.com/wallets/restoreBitcoinWallet");

	req.end(function (res) {
		console.log(res.status);
	 	console.log(res.body);
	});
}

signUp("Benoit Murugan", "benoit.murugan@email.com", "293.676.434-38", "pTsnap'eFgyFx`A,");
restoreBitcoinWallet();
