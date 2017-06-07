let bitcoin = require('bitcoinjs-lib')
let crypto = require('crypto')

module.exports = function(app) {

	let WalletController = {
		restoreBitcoinWallet: function(req, res) {

			let Wallet = app.models.wallet;

			Wallet.findOne({code: 'BTC'}, function(err, wallet) {
				if (err) {
					return res.status(500).json({
						message: 'An error occured',
						error: err
					});
				}

				let publicKeyAddress = null;
				let algorithm = 'aes-256-ctr'
				let bitcoinWalletSecret = process.env.BITCOIN_WALLET_SECRET;

				if (!wallet) {
					let keyPair = bitcoin.ECPair.makeRandom()
					let encryptedKey = encrypt(keyPair.toWIF(), algorithm, bitcoinWalletSecret);

					publicKeyAddress = keyPair.getAddress();

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
					publicKeyAddress = keyPair.getAddress();
				}

				return res.json({publicKeyAddress: publicKeyAddress});
			});
		},
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