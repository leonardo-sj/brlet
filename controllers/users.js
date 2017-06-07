module.exports = function(app) {

	let sanitize = require('mongo-sanitize');
	let bcrypt = require('bcrypt');
	let jwt = require('jsonwebtoken');

	let User = app.models.user;

	let UserController = {
		signUp: function(req, res) {
			
			let saltRounds = 10;

			bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
				let data = {
					name: sanitize(req.body.name),
					cpf: sanitize(req.body.cpf),
					email: sanitize(req.body.email),
					password: hash
				};

				new User(data).save(function (err, user) {
					if (err) {

						let status = 500;
						let errRes = {
							message: 'An error occurred',
							error: err
						}

						if (err.code == 11000 || err.code == 11001) {
							status = 409;
							errRes.error = "existing email";
						}

						res.status(status).json(errRes);
					} else {
						let token = jwt.sign({user: user.responseJson()}, process.env.JWT_SECRET, {expiresIn: 36000});
						res.status(201).json({
							message: 'Successfully signed up',
							token: token,
							userId: user._id
						});
					}
				});
			});
		}
	}

	return UserController;
}