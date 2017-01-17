
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {type :String , require : true},
    lastName: {type :String , require : true},
    email: {type :String , require : true },
    password: {type :String , require : true},
    mobileNumber: Number
});


var User = mongoose.model('User', userSchema);
module.exports = User;
