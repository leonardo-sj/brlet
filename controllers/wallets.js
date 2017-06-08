let bitcoin = require('bitcoinjs-lib')
let crypto = require('crypto')
let bitcore = require('bitcore-lib-dash')

module.exports = function(app) {

	let Wallet = app.models.wallet;
	let algorithm = 'aes-256-ctr';
	let bitcoinWalletSecret = process.env.BITCOIN_WALLET_SECRET;

	let WalletController = {
		restoreBitcoinWallet: function(req, res) {

			Wallet.findOne({code: 'BTC'}, function(err, wallet) {
				if (err) {
					return res.status(500).json({
						message: 'An error occured',
						error: err
					});
				}

				let address = null;

				if (!wallet) {
					let keyPair = bitcoin.ECPair.makeRandom()
					let encryptedKey = encrypt(keyPair.toWIF(), algorithm, bitcoinWalletSecret);

					address = keyPair.getAddress();

					new Wallet({
						name: 'Bitcoin',
						code: 'BTC',
						encryptedPrivateKey: encryptedKey
					}).save(function (err, user) {
						if (err) {
							return res.status(500).json({
								message: 'An error occured',
								error: err
							});
						}
					});

				} else {
					let privateKeyWIF = decrypt(wallet.encryptedPrivateKey, algorithm, bitcoinWalletSecret);
					let keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF);
					address = keyPair.getAddress();
				}

				return res.json({address: address});
			});
		},

		restoreDashWallet: function(req, res) {
			Wallet.findOne({code: 'DASH'}, function(err, wallet) {

				if (err) {
					return res.status(500).json({
						message: 'An error occured',
						error: err
					});
				}

				let address = null;

				if (!wallet) {

					let privateKey = new bitcore.PrivateKey();
					let encryptedKey = encrypt(privateKey.toWIF(), algorithm, bitcoinWalletSecret);

					address = `${privateKey.toAddress()}`;

					new Wallet({
						name: 'Dash',
						code: 'DASH',
						encryptedPrivateKey: encryptedKey
					}).save(function (err, user) {
						if (err) {
							return res.status(500).json({
								message: 'An error occured',
								error: err
							});
						}
					});

				} else {
					let privateKeyWIF = decrypt(wallet.encryptedPrivateKey, algorithm, bitcoinWalletSecret);
					address = `${new bitcore.PrivateKey(privateKeyWIF).toAddress()}`;
				}

				return res.json({address: address});
			});
		}
	}

	return WalletController;
}

function encrypt(privateKey, algorithm, secret) {
	var cipher = crypto.createCipher(algorithm, secret)
	var crypted = cipher.update(privateKey,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(encryptedKey, algorithm, secret){
	var decipher = crypto.createDecipher(algorithm, secret)
	var dec = decipher.update(encryptedKey,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}