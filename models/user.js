module.exports = function(app) {

  let db = require('../db_connect')();
  let Schema = require('mongoose').Schema;

  let UserSchema = new Schema({
    name: {type:String, required: true},
    cpf: String,
    email: {type:String, required: true, index: {unique:true}},
    password: String,
    created: { type: Date, default: Date.now }
  });

  UserSchema.methods.responseJson = function () {
    let user = this.toObject();
    delete user.password;
    delete user.created;
    delete user.__v;
    return user;
  }

  return db.model('User', UserSchema);
};