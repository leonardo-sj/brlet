module.exports = function(app) {

	var router = require('express').Router();
	var walletController = app.controllers.wallets;

	router.get('/restoreBitcoinWallet', walletController.restoreBitcoinWallet);

	router.get('/restoreDashWallet', walletController.restoreDashWallet);

	app.use('/wallets', router);
}