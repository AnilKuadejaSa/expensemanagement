
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {type :String , require : true},
    lastName: {type :String , require : true},
    email: {type :String , require : true },
    password: {type :String , require : true},
    phoneNumber : {type : Int,require : false},
    lent : {type : Double,require : true},
    owes : {type : Double,require : true}
});

module.exports = mongoose.model('user', userSchema);
