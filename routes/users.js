module.exports = function(app) {

	var router = require('express').Router();
	var userController = app.controllers.users;

	router.get('/test', function(req, res) {
		res.json({status: 1});
	});

	router.post('/signUp', userController.signUp);

	app.use('/users', router);
}