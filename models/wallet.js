module.exports = function(app) {

	let db = require('../db_connect')();
	let Schema = require('mongoose').Schema;

	let WalletSchema = new Schema({
		name: {type:String, required: true},
		code: {type:String, required: true, index: {unique:true}},
		encryptedPrivateKey: {type:String, required: true}
	});

	return db.model('Wallet', WalletSchema);
}