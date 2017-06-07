module.exports = function(app) {

	var router = require('express').Router();
	var walletController = app.controllers.wallets;

	router.get('/restoreBitcoinWallet', walletController.restoreBitcoinWallet);

	app.use('/wallets', router);
}