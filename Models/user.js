
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {type :String , require : true},
    lastName: {type :String , require : true},
    email: {type :String , require : true },
    password: {type :String , require : true},
});


var User = mongoose.model('users', userSchema);
module.exports = User;
